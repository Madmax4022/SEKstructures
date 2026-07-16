-- ============================================================================
-- SEK Estructuras — Etapa 0: esquema inicial
-- Modelo de datos del concepto v0.6 + dictamen de captura (docs/04)
-- Ejecutar en un proyecto Supabase (SQL Editor) o con `supabase db push`
-- ============================================================================

-- ===== Enumeraciones ========================================================

create type rol_usuario as enum ('INSPECTOR','ADMINISTRACION','DIRECCION_TECNICA','GERENCIA');
create type tipo_elemento as enum ('ESTRUCTURAL','NO_ESTRUCTURAL');
create type origen_hallazgo as enum ('NORMADO','NO_NORMADO'); -- capturado como "¿cómo lo detectaste?" (dictamen §8)
create type severidad_riesgo as enum ('INMINENTE','CRITICA','MODERADA','MENOR');
create type probabilidad_riesgo as enum ('BAJA','MEDIA','ALTA');
create type estado_informe as enum ('BORRADOR','EMITIDO');

-- ===== Perfiles (extiende auth.users) =======================================

create table perfil (
  id uuid primary key references auth.users(id) on delete cascade,
  nombre text not null,
  rol rol_usuario not null default 'INSPECTOR',
  colegiatura_registro text,
  es_profesional_competente boolean not null default false,
  created_at timestamptz not null default now()
);

-- ===== Proyecto y membresía (multi-tenant desde el día 1) ===================

create table proyecto (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  ubicacion text,
  -- referencias normativas OPCIONALES (norma abierta, v0.4)
  categoria_riesgo_edificacion text check (categoria_riesgo_edificacion in ('I','II','III','IV')),
  nivel_sismicidad text,
  nivel_desempeno_objetivo text,
  created_at timestamptz not null default now()
);

create table proyecto_miembro (
  proyecto_id uuid not null references proyecto(id) on delete cascade,
  usuario_id uuid not null references perfil(id) on delete cascade,
  rol_en_proyecto rol_usuario not null default 'INSPECTOR',
  created_at timestamptz not null default now(),
  primary key (proyecto_id, usuario_id)
);

-- Helper de RLS: ¿el usuario autenticado es miembro del proyecto?
create function es_miembro(p_proyecto uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from proyecto_miembro
                  where proyecto_id = p_proyecto and usuario_id = auth.uid()) $$;

-- ===== Módulos e inspecciones ===============================================

create table modulo (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyecto(id) on delete cascade,
  nombre text not null,
  descripcion text,
  created_at timestamptz not null default now()
);

create table inspeccion (
  id uuid primary key default gen_random_uuid(),
  proyecto_id uuid not null references proyecto(id) on delete cascade,
  modulo_id uuid not null references modulo(id),
  inspector_id uuid not null references perfil(id),
  tecnico_acompanante text,
  fecha date not null default current_date,
  hora_inicio time,
  hora_fin time,
  condiciones_clima_iluminacion text,
  -- checklist de seguridad del inspector (ATS/EPP, dictamen S1) — obligatorio antes del recorrido
  checklist_seguridad jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- ===== Hallazgo (entidad central) ===========================================

create table hallazgo (
  id uuid primary key default gen_random_uuid(),        -- UUID generable en cliente (sync-ready, U2)
  proyecto_id uuid not null references proyecto(id) on delete cascade,
  inspeccion_id uuid not null references inspeccion(id) on delete cascade,
  numero int not null,                                   -- correlativo dentro de la inspección
  ubicacion text not null,
  es_local_comercial boolean not null default false,
  tipo_elemento tipo_elemento not null,
  tipo_estructural text,                                 -- columna|viga|muro… (E3, opcional)
  categoria_no_estructural text,                         -- 1 de 11 (opcional)
  -- síntomas observables (dictamen §2 y §7): la app ordena la prioridad
  sintoma_principal text not null,
  sintomas text[] not null default '{}',                 -- ordenados por prioridad técnica
  medida_guiada text,                                    -- tarjeta/moneda/dedo (fisuras)
  descripcion text not null,
  -- origen: capturado como hecho ("¿cómo lo detectaste?", dictamen §8)
  origen origen_hallazgo not null default 'NO_NORMADO',
  ref_norma text,                                        -- la ancla el ingeniero en gabinete (E5)
  resultado_checklist text check (resultado_checklist in ('COMPLIANT','NON_COMPLIANT','NA')),
  -- riesgo calculado por el asistente (S2/U6); el ajuste manual exige justificación
  nivel_riesgo smallint not null check (nivel_riesgo between 1 and 5),
  severidad severidad_riesgo,
  probabilidad probabilidad_riesgo,
  regla_dura boolean not null default false,             -- gas / contra incendios / colapso → 5
  riesgo_justificacion text,
  requiere_analisis_mayor boolean not null default false,-- Tier 2/3 (E6); auto en niveles 4-5
  detalle_ingeniero jsonb,                               -- 5 preguntas verticales (solo nivel 4)
  responsable_sugerido text,
  plazo_sugerido text,                                   -- recomendación del entregable, no vigilancia
  created_at timestamptz not null default now(),
  unique (inspeccion_id, numero)
);

-- ===== Evidencia y mediciones ===============================================

create table foto (
  id uuid primary key default gen_random_uuid(),
  hallazgo_id uuid not null references hallazgo(id) on delete cascade,
  storage_path text not null,                            -- ruta en Supabase Storage (URLs firmadas, U9)
  geolocalizacion jsonb,
  tomada_en timestamptz not null default now()
  -- INMUTABLE: sin política de UPDATE/DELETE (cadena de custodia, S6)
);

create table medicion (
  id uuid primary key default gen_random_uuid(),
  hallazgo_id uuid not null references hallazgo(id) on delete cascade,
  tipo text not null,                                    -- ancho_fisura_mm | desplome | deflexión | corrosión | otro
  valor numeric,
  unidad text,
  fecha timestamptz not null default now()
);

-- ===== Alcance real: elementos no evaluados (valor legal) ===================

create table elemento_no_evaluado (
  id uuid primary key default gen_random_uuid(),
  inspeccion_id uuid not null references inspeccion(id) on delete cascade,
  descripcion text not null,
  motivo text not null,
  medio_intentado text not null,
  created_at timestamptz not null default now()
);

-- ===== Informe (el entregable — clímax del producto) ========================

create table informe (
  id uuid primary key default gen_random_uuid(),
  inspeccion_id uuid not null references inspeccion(id) on delete cascade,
  estado estado_informe not null default 'BORRADOR',
  emitido_por uuid references perfil(id),
  colegiatura_registro text,
  sello_tiempo timestamptz,
  resumen_por_nivel jsonb,
  declaracion_alcance text,                              -- compliance B (v0.6)
  matriz_seguimiento_path text,                          -- compliance A (v0.6): anexo exportable
  entregado_a text,
  fecha_entrega timestamptz,
  created_at timestamptz not null default now()
);

-- Un informe EMITIDO es inmutable (sello de tiempo con peso legal, E8)
create function bloquear_informe_emitido() returns trigger
language plpgsql as $$
begin
  if old.estado = 'EMITIDO' then
    raise exception 'Un informe emitido es inmutable';
  end if;
  return new;
end $$;

create trigger trg_informe_inmutable
  before update or delete on informe
  for each row execute function bloquear_informe_emitido();

-- ===== Auditoría (cadena de custodia, S6) ===================================

create table auditoria (
  id bigint generated always as identity primary key,
  tabla text not null,
  registro_id uuid not null,
  accion text not null,                                  -- INSERT | UPDATE | DELETE
  usuario_id uuid,
  datos jsonb,
  at timestamptz not null default now()
);

create function registrar_auditoria() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into auditoria (tabla, registro_id, accion, usuario_id, datos)
  values (tg_table_name,
          coalesce(new.id, old.id),
          tg_op,
          auth.uid(),
          case when tg_op = 'DELETE' then to_jsonb(old) else to_jsonb(new) end);
  return coalesce(new, old);
end $$;

create trigger trg_auditoria_hallazgo after insert or update or delete on hallazgo
  for each row execute function registrar_auditoria();
create trigger trg_auditoria_informe after insert or update or delete on informe
  for each row execute function registrar_auditoria();
create trigger trg_auditoria_foto after insert or delete on foto
  for each row execute function registrar_auditoria();

-- ===== RLS: acceso por membresía de proyecto ================================

alter table perfil enable row level security;
alter table proyecto enable row level security;
alter table proyecto_miembro enable row level security;
alter table modulo enable row level security;
alter table inspeccion enable row level security;
alter table hallazgo enable row level security;
alter table foto enable row level security;
alter table medicion enable row level security;
alter table elemento_no_evaluado enable row level security;
alter table informe enable row level security;
alter table auditoria enable row level security;

-- perfil: cada quien ve y edita el suyo
create policy perfil_select on perfil for select using (id = auth.uid());
create policy perfil_update on perfil for update using (id = auth.uid());
create policy perfil_insert on perfil for insert with check (id = auth.uid());

-- proyecto: solo miembros
create policy proyecto_select on proyecto for select using (es_miembro(id));
create policy proyecto_insert on proyecto for insert with check (auth.uid() is not null);
create policy proyecto_update on proyecto for update using (es_miembro(id));

-- membresía: los miembros ven quién está en el proyecto
create policy miembro_select on proyecto_miembro for select using (es_miembro(proyecto_id));
create policy miembro_insert on proyecto_miembro for insert
  with check (es_miembro(proyecto_id) or usuario_id = auth.uid());

-- módulo / inspección / hallazgo: por proyecto
create policy modulo_all on modulo for all using (es_miembro(proyecto_id)) with check (es_miembro(proyecto_id));
create policy inspeccion_all on inspeccion for all using (es_miembro(proyecto_id)) with check (es_miembro(proyecto_id));
create policy hallazgo_all on hallazgo for all using (es_miembro(proyecto_id)) with check (es_miembro(proyecto_id));

-- foto: SELECT e INSERT para miembros; sin UPDATE ni DELETE (inmutable)
create policy foto_select on foto for select
  using (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)));
create policy foto_insert on foto for insert
  with check (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)));

-- medición y elementos no evaluados: por proyecto (vía padre)
create policy medicion_all on medicion for all
  using (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)))
  with check (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)));
create policy unev_all on elemento_no_evaluado for all
  using (exists (select 1 from inspeccion i where i.id = inspeccion_id and es_miembro(i.proyecto_id)))
  with check (exists (select 1 from inspeccion i where i.id = inspeccion_id and es_miembro(i.proyecto_id)));

-- informe: ver/crear/editar miembros; EMITIR solo profesional competente
create policy informe_select on informe for select
  using (exists (select 1 from inspeccion i where i.id = inspeccion_id and es_miembro(i.proyecto_id)));
create policy informe_insert on informe for insert
  with check (exists (select 1 from inspeccion i where i.id = inspeccion_id and es_miembro(i.proyecto_id)));
create policy informe_update on informe for update
  using (exists (select 1 from inspeccion i where i.id = inspeccion_id and es_miembro(i.proyecto_id)))
  with check (
    estado <> 'EMITIDO'
    or exists (select 1 from perfil p where p.id = auth.uid() and p.es_profesional_competente)
  );

-- auditoría: solo lectura para miembros del proyecto implicado; nadie escribe
-- (las escrituras entran por el trigger security definer)
create policy auditoria_select on auditoria for select
  using (exists (select 1 from proyecto_miembro pm where pm.usuario_id = auth.uid()));

-- ===== Storage: bucket de evidencia =========================================
-- Crear el bucket 'evidencia' (privado) desde el panel de Supabase o CLI.
-- Acceso mediante URLs firmadas generadas por la app (U9).

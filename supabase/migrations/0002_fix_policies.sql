-- ============================================================================
-- SEK Estructuras — Reparación idempotente de políticas RLS
-- Correr si aparece "new row violates row-level security policy" (p. ej. cuando
-- la migración 0001 se aplicó parcialmente). Se puede ejecutar varias veces.
-- ============================================================================

create or replace function es_miembro(p_proyecto uuid) returns boolean
language sql stable security definer set search_path = public as
$$ select exists (select 1 from proyecto_miembro
                  where proyecto_id = p_proyecto and usuario_id = auth.uid()) $$;

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

drop policy if exists perfil_select on perfil;
drop policy if exists perfil_update on perfil;
drop policy if exists perfil_insert on perfil;
create policy perfil_select on perfil for select using (id = auth.uid());
create policy perfil_update on perfil for update using (id = auth.uid());
create policy perfil_insert on perfil for insert with check (id = auth.uid());

drop policy if exists proyecto_select on proyecto;
drop policy if exists proyecto_insert on proyecto;
drop policy if exists proyecto_update on proyecto;
create policy proyecto_select on proyecto for select using (es_miembro(id));
create policy proyecto_insert on proyecto for insert with check (auth.uid() is not null);
create policy proyecto_update on proyecto for update using (es_miembro(id));

drop policy if exists miembro_select on proyecto_miembro;
drop policy if exists miembro_insert on proyecto_miembro;
create policy miembro_select on proyecto_miembro for select using (es_miembro(proyecto_id));
create policy miembro_insert on proyecto_miembro for insert
  with check (es_miembro(proyecto_id) or usuario_id = auth.uid());

drop policy if exists modulo_all on modulo;
create policy modulo_all on modulo for all using (es_miembro(proyecto_id)) with check (es_miembro(proyecto_id));

drop policy if exists inspeccion_all on inspeccion;
create policy inspeccion_all on inspeccion for all using (es_miembro(proyecto_id)) with check (es_miembro(proyecto_id));

drop policy if exists hallazgo_all on hallazgo;
create policy hallazgo_all on hallazgo for all using (es_miembro(proyecto_id)) with check (es_miembro(proyecto_id));

drop policy if exists foto_select on foto;
drop policy if exists foto_insert on foto;
create policy foto_select on foto for select
  using (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)));
create policy foto_insert on foto for insert
  with check (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)));

drop policy if exists medicion_all on medicion;
create policy medicion_all on medicion for all
  using (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)))
  with check (exists (select 1 from hallazgo h where h.id = hallazgo_id and es_miembro(h.proyecto_id)));

drop policy if exists unev_all on elemento_no_evaluado;
create policy unev_all on elemento_no_evaluado for all
  using (exists (select 1 from inspeccion i where i.id = inspeccion_id and es_miembro(i.proyecto_id)))
  with check (exists (select 1 from inspeccion i where i.id = inspeccion_id and es_miembro(i.proyecto_id)));

drop policy if exists informe_select on informe;
drop policy if exists informe_insert on informe;
drop policy if exists informe_update on informe;
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

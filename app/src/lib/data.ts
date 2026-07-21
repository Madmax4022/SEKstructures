import { supabase } from './supabase';
import type { Hallazgo, Modulo, Proyecto } from '../types/db';

// ============================================================
// Plantillas de secciones sugeridas por tipo de edificio.
// Codifican el "reconocimiento previo" del procedimiento:
// las zonas que típicamente se escapan (pasillos de servicio,
// mezanines, cubiertas…) vienen sugeridas, no de memoria.
// ============================================================
export const TIPOS_EDIFICIO = ['Centro comercial', 'Oficinas', 'Industrial', 'Mixto / otro'] as const;
export type TipoEdificio = (typeof TIPOS_EDIFICIO)[number];

export const SECCIONES_SUGERIDAS: Record<TipoEdificio, string[]> = {
  'Centro comercial': [
    'Sótanos / parqueos',
    'Cuarto de máquinas',
    'Pasillos de servicio',
    'Food court',
    'Cubiertas',
    'Mezanines',
    'Locales — pasillo A',
    'Locales — pasillo B',
    'Áreas comunes N1',
    'Áreas comunes N2',
  ],
  Oficinas: [
    'Sótanos / parqueos',
    'Núcleo de escaleras y ascensores',
    'Cuartos eléctricos',
    'Planta N1',
    'Planta N2',
    'Planta N3',
    'Azotea / cubierta',
  ],
  Industrial: [
    'Nave principal',
    'Mezanines',
    'Cuarto de máquinas',
    'Racks / estanterías estructurales',
    'Cubiertas',
    'Andenes de carga',
    'Oficinas administrativas',
  ],
  'Mixto / otro': ['Sótanos', 'Nivel 1', 'Nivel 2', 'Cubiertas', 'Áreas comunes'],
};

function db() {
  if (!supabase) throw new Error('Supabase no está configurado');
  return supabase;
}

/** Garantiza que exista la fila de perfil del usuario autenticado (FK de membresías). */
export async function asegurarPerfil(): Promise<void> {
  const s = db();
  const { data: u } = await s.auth.getUser();
  if (!u.user) return;
  const nombre = u.user.email?.split('@')[0] ?? 'Usuario';
  await s.from('perfil').upsert({ id: u.user.id, nombre }, { onConflict: 'id' });
}

export async function listarProyectos(): Promise<Proyecto[]> {
  const { data, error } = await db().from('proyecto').select('*').order('created_at');
  if (error) throw new Error(error.message);
  return (data ?? []) as Proyecto[];
}

/**
 * Crea el proyecto, la membresía del creador y sus secciones, en ese orden.
 *
 * El id se genera EN EL CLIENTE (diseño sync-ready, U2) y el insert va sin
 * RETURNING: con RLS, "insert ... returning" exige que la fila sea visible por
 * la política de SELECT, y en ese instante el creador aún no es miembro
 * (huevo y gallina → "new row violates row-level security policy").
 * El proyecto se lee al final, ya con la membresía creada.
 */
export async function crearProyectoConSecciones(
  nombre: string,
  ubicacion: string,
  secciones: string[],
): Promise<Proyecto> {
  const s = db();
  const { data: u } = await s.auth.getUser();
  if (!u.user) throw new Error('Sesión no válida');

  // Aseguramos el perfil aquí mismo: proyecto_miembro tiene FK a perfil.
  await asegurarPerfil();

  const id = crypto.randomUUID();
  const { error: e1 } = await s
    .from('proyecto')
    .insert({ id, nombre, ubicacion: ubicacion || null });
  if (e1) throw new Error(`[paso 1: crear proyecto · uid ${u.user.id.slice(0, 8)}] ${e1.message}`);

  const { error: e2 } = await s
    .from('proyecto_miembro')
    .insert({ proyecto_id: id, usuario_id: u.user.id, rol_en_proyecto: 'INSPECTOR' });
  if (e2) throw new Error(`[paso 2: membresía] ${e2.message}`);

  if (secciones.length) {
    const filas = secciones.map((nombre) => ({ proyecto_id: id, nombre }));
    const { error: e3 } = await s.from('modulo').insert(filas);
    if (e3) throw new Error(`[paso 3: secciones] ${e3.message}`);
  }

  const { data: proyecto, error: e4 } = await s.from('proyecto').select('*').eq('id', id).single();
  if (e4) throw new Error(`[paso 4: lectura] ${e4.message}`);
  return proyecto as Proyecto;
}

export async function listarModulos(proyectoId: string): Promise<Modulo[]> {
  const { data, error } = await db()
    .from('modulo')
    .select('*')
    .eq('proyecto_id', proyectoId)
    .order('created_at');
  if (error) throw new Error(error.message);
  return (data ?? []) as Modulo[];
}

export async function agregarModulo(proyectoId: string, nombre: string): Promise<void> {
  const { error } = await db().from('modulo').insert({ proyecto_id: proyectoId, nombre });
  if (error) throw new Error(error.message);
}

/** Crea la inspección tras el checklist de seguridad (ATS/EPP). Devuelve su id. */
export async function crearInspeccion(
  proyectoId: string,
  moduloId: string,
  checklistSeguridad: Record<string, boolean>,
): Promise<string> {
  const s = db();
  const { data: u } = await s.auth.getUser();
  if (!u.user) throw new Error('Sesión no válida');
  const id = crypto.randomUUID();
  const { error } = await s.from('inspeccion').insert({
    id,
    proyecto_id: proyectoId,
    modulo_id: moduloId,
    inspector_id: u.user.id,
    checklist_seguridad: checklistSeguridad,
  });
  if (error) throw new Error(error.message);
  return id;
}

export async function listarHallazgos(inspeccionId: string): Promise<Hallazgo[]> {
  const { data, error } = await db()
    .from('hallazgo')
    .select('*')
    .eq('inspeccion_id', inspeccionId)
    .order('nivel_riesgo', { ascending: false })
    .order('numero');
  if (error) throw new Error(error.message);
  return (data ?? []) as Hallazgo[];
}

export type NuevoHallazgoInput = Omit<Hallazgo, 'id' | 'created_at'>;

export async function crearHallazgo(h: NuevoHallazgoInput): Promise<void> {
  const { error } = await db()
    .from('hallazgo')
    .insert({ id: crypto.randomUUID(), ...h });
  if (error) throw new Error(error.message);
}

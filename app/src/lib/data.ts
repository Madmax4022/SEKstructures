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

export async function crearHallazgo(h: NuevoHallazgoInput): Promise<string> {
  const id = crypto.randomUUID();
  const { error } = await db().from('hallazgo').insert({ id, ...h });
  if (error) throw new Error(error.message);
  return id;
}

/** Sube la foto al bucket 'evidencia' y registra la fila inmutable. */
export async function subirFoto(proyectoId: string, hallazgoId: string, file: File): Promise<void> {
  const s = db();
  const path = `${proyectoId}/${hallazgoId}/${Date.now()}.jpg`;
  const { error: e1 } = await s.storage.from('evidencia').upload(path, file, { contentType: file.type || 'image/jpeg' });
  if (e1) throw new Error(`[foto: subida] ${e1.message}`);
  const { error: e2 } = await s.from('foto').insert({ id: crypto.randomUUID(), hallazgo_id: hallazgoId, storage_path: path });
  if (e2) throw new Error(`[foto: registro] ${e2.message}`);
}

export interface NoEvaluado { id: string; inspeccion_id: string; descripcion: string; motivo: string; medio_intentado: string }

export async function listarNoEvaluados(inspeccionId: string): Promise<NoEvaluado[]> {
  const { data, error } = await db().from('elemento_no_evaluado').select('*').eq('inspeccion_id', inspeccionId).order('created_at');
  if (error) throw new Error(error.message);
  return (data ?? []) as NoEvaluado[];
}

export async function agregarNoEvaluado(inspeccionId: string, descripcion: string, motivo: string, medio: string): Promise<void> {
  const { error } = await db().from('elemento_no_evaluado')
    .insert({ id: crypto.randomUUID(), inspeccion_id: inspeccionId, descripcion, motivo, medio_intentado: medio });
  if (error) throw new Error(error.message);
}

export async function obtenerPerfil(): Promise<{ nombre: string; colegiatura_registro: string | null }> {
  const s = db();
  const { data: u } = await s.auth.getUser();
  const { data } = await s.from('perfil').select('nombre,colegiatura_registro').eq('id', u.user?.id ?? '').single();
  return (data as { nombre: string; colegiatura_registro: string | null }) ?? { nombre: 'Inspector', colegiatura_registro: null };
}

export async function contarFotos(hallazgoIds: string[]): Promise<number> {
  if (!hallazgoIds.length) return 0;
  const { count } = await db().from('foto').select('id', { count: 'exact', head: true }).in('hallazgo_id', hallazgoIds);
  return count ?? 0;
}

export async function emitirInforme(args: {
  inspeccionId: string; colegiatura: string; resumen: Record<string, number>;
  declaracion: string; entregadoA: string;
}): Promise<void> {
  const s = db();
  const { data: u } = await s.auth.getUser();
  if (!u.user) throw new Error('Sesión no válida');
  await s.from('perfil').update({ colegiatura_registro: args.colegiatura }).eq('id', u.user.id);
  const { error } = await s.from('informe').insert({
    id: crypto.randomUUID(),
    inspeccion_id: args.inspeccionId,
    estado: 'EMITIDO',
    emitido_por: u.user.id,
    colegiatura_registro: args.colegiatura,
    sello_tiempo: new Date().toISOString(),
    resumen_por_nivel: args.resumen,
    declaracion_alcance: args.declaracion,
    entregado_a: args.entregadoA || null,
    fecha_entrega: new Date().toISOString(),
  });
  if (error) throw new Error(error.message);
}

/**
 * (A2) Comprime la foto en el propio teléfono antes de subirla: reescala el lado
 * mayor y recodifica a JPEG. Una foto de cámara (3–6 MB) baja a ~200–500 KB, lo
 * que hace viable subir 30 hallazgos con datos móviles.
 */
export async function comprimirImagen(file: File, maxLado = 1600, calidad = 0.75): Promise<File> {
  try {
    const bitmap = await createImageBitmap(file);
    const escala = Math.min(1, maxLado / Math.max(bitmap.width, bitmap.height));
    const w = Math.round(bitmap.width * escala);
    const h = Math.round(bitmap.height * escala);
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close();
    const blob = await new Promise<Blob | null>((res) => canvas.toBlob(res, 'image/jpeg', calidad));
    if (!blob || blob.size >= file.size) return file;
    return new File([blob], 'foto.jpg', { type: 'image/jpeg' });
  } catch {
    return file; // si el navegador no soporta la API, se sube el original
  }
}

/** (A1) Descarga las fotos de un hallazgo como data URL, para incrustarlas en el PDF. */
export async function fotosComoDataUrl(hallazgoIds: string[]): Promise<Map<string, string[]>> {
  const mapa = new Map<string, string[]>();
  if (!hallazgoIds.length) return mapa;
  const s = db();
  const { data } = await s.from('foto').select('hallazgo_id,storage_path').in('hallazgo_id', hallazgoIds);
  for (const f of (data ?? []) as { hallazgo_id: string; storage_path: string }[]) {
    const { data: blob } = await s.storage.from('evidencia').download(f.storage_path);
    if (!blob) continue;
    const url = await new Promise<string>((res) => {
      const r = new FileReader();
      r.onloadend = () => res(String(r.result));
      r.readAsDataURL(blob);
    });
    mapa.set(f.hallazgo_id, [...(mapa.get(f.hallazgo_id) ?? []), url]);
  }
  return mapa;
}

/** (A3) Enlaces firmados temporales para ver las fotos de un hallazgo en pantalla. */
export async function urlsFotos(hallazgoId: string): Promise<string[]> {
  const s = db();
  const { data } = await s.from('foto').select('storage_path').eq('hallazgo_id', hallazgoId);
  const urls: string[] = [];
  for (const f of (data ?? []) as { storage_path: string }[]) {
    const { data: firmada } = await s.storage.from('evidencia').createSignedUrl(f.storage_path, 3600);
    if (firmada?.signedUrl) urls.push(firmada.signedUrl);
  }
  return urls;
}

/** (A3) Elimina un hallazgo capturado por error. Las fotos se borran en cascada. */
export async function borrarHallazgo(id: string): Promise<void> {
  const { error } = await db().from('hallazgo').delete().eq('id', id);
  if (error) throw new Error(error.message);
}

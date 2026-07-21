// Criterio de captura Tier 1 (docs/04-criterio-captura-tier1.md)
// Síntomas observables, prioridad técnica, combos delatores y matriz de riesgo.

export const CAT_E = ['Columna', 'Viga', 'Muro / cortante', 'Marco', 'Conexión / soldadura', 'Diafragma / entrepiso', 'Cimentación'];
export const CAT_NE = ['Sistema de protección a la vida', 'Materiales peligrosos', 'Particiones', 'Cielos arquitectónicos', 'Luminarias', 'Ventanería', 'Escaleras', 'Contenido y mobiliario', 'Equipo eléctrico y mecánico', 'Tuberías', 'Ductos'];

export interface SintomaDef { k: string; t: string; svg: string }
export const SINTOMAS: SintomaDef[] = [
  { k: 'fisura', t: 'Fisura / grieta', svg: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M9.5 4l2 5-3 4 4 3-1.2 4"/>' },
  { k: 'pandeo', t: 'Deformación / pandeo', svg: '<path d="M6 3h12M6 21h12"/><path d="M12 3c-3.6 4.8 3.6 13.2 0 18"/>' },
  { k: 'oxido', t: 'Corrosión / óxido', svg: '<circle cx="12" cy="12" r="8"/><circle cx="9" cy="10" r=".9" fill="currentColor" stroke="none"/><circle cx="13.6" cy="14.2" r=".9" fill="currentColor" stroke="none"/><circle cx="14.2" cy="9" r=".9" fill="currentColor" stroke="none"/><circle cx="9.8" cy="15" r=".9" fill="currentColor" stroke="none"/>' },
  { k: 'desprend', t: 'Desprendimiento', svg: '<path d="M9 4h11v16H4V9z"/><path d="M7.5 2.5L2.5 7.5" stroke-dasharray="2 2"/>' },
  { k: 'acero', t: 'Acero expuesto', svg: '<rect x="4" y="4" width="16" height="16" rx="1"/><path d="M8.5 9v6M12 9v6M15.5 9v6"/>' },
  { k: 'humedad', t: 'Humedad / mancha', svg: '<path d="M12 3.5C8.5 8 6 11 6 14a6 6 0 0 0 12 0c0-3-2.5-6-6-10.5z"/>' },
  { k: 'asenta', t: 'Asentamiento / desnivel', svg: '<path d="M3 13.5l18-5"/><path d="M7 21v-4.5M12 21v-6M17 21v-7.5"/>' },
  { k: 'suelto', t: 'Suelto / mal anclado', svg: '<path d="M5 8V5h14v3"/><rect x="8" y="12" width="8" height="7" rx="1"/><path d="M12 8v2.5" stroke-dasharray="1.5 1.5"/>' },
  { k: 'impacto', t: 'Impacto / daño', svg: '<path d="M12 4v3.5M12 16.5V20M4 12h3.5M16.5 12H20M6.7 6.7l2.4 2.4M17.3 6.7l-2.4 2.4M6.7 17.3l2.4-2.4M17.3 17.3l-2.4-2.4"/>' },
  { k: 'faltante', t: 'Faltante / removido', svg: '<rect x="5" y="5" width="14" height="14" rx="2" stroke-dasharray="3 3"/><path d="M9 12h6"/>' },
  { k: 'modif', t: 'Modificación no autorizada', svg: '<rect x="4" y="4" width="16" height="16" rx="1"/><circle cx="12" cy="12" r="3"/><path d="M5.5 18.5l13-13"/>' },
  { k: 'otro', t: 'Otro', svg: '<circle cx="6" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="12" cy="12" r="1.3" fill="currentColor" stroke="none"/><circle cx="18" cy="12" r="1.3" fill="currentColor" stroke="none"/>' },
];
export const SYM_LABEL: Record<string, string> = Object.fromEntries(SINTOMAS.map((s) => [s.k, s.t]));

/** Prioridad técnica fija — la define el profesional competente, no el orden de clic. */
export const SYM_PRIORITY = ['pandeo', 'asenta', 'fisura', 'acero', 'desprend', 'suelto', 'impacto', 'oxido', 'modif', 'faltante', 'humedad', 'otro'];
export const sortSym = (keys: string[]) => [...keys].sort((a, b) => SYM_PRIORITY.indexOf(a) - SYM_PRIORITY.indexOf(b));

export const SYM_COMBOS: { req: string[]; msg: string }[] = [
  { req: ['fisura', 'pandeo'], msg: 'Fisura + deformación suele indicar compromiso estructural en curso' },
  { req: ['acero', 'oxido'], msg: 'Acero expuesto + óxido indica corrosión activa del refuerzo' },
  { req: ['desprend', 'acero'], msg: 'Desprendimiento + acero expuesto indica pérdida de recubrimiento (deterioro activo)' },
];

export const MEDIDAS = [
  { v: 'Nada (<1 mm)', t: 'Nada', sub: '< 1 mm' },
  { v: 'Tarjeta (~1 mm)', t: 'Una tarjeta', sub: '≈ 1 mm' },
  { v: 'Moneda (2–3 mm)', t: 'Una moneda', sub: '≈ 2–3 mm' },
  { v: 'Dedo (≥10 mm)', t: 'Un dedo', sub: '≥ 10 mm' },
];

export const MATRIZ = [
  [4, 5, 5],
  [3, 4, 4],
  [2, 3, 3],
  [1, 1, 2],
] as const;

export const PLAZO: Record<number, string> = {
  5: 'Mitigación ≤ 72 h · reparación ≤ 3 meses',
  4: 'Reparación ≤ 3 meses',
  3: '3 meses – 1 año',
  2: '3 meses – 1 año',
  1: 'Según programación',
};

export const SEV_OPTS = [
  { i: 0, enum: 'INMINENTE' as const, t: 'Inminente', sub: 'sobre personas, evacuación, gas o incendio', c: 'var(--risk-5)', svg: '<path d="M8 2.5h8L21.5 8v8L16 21.5H8L2.5 16V8z"/><path d="M12 7.5v6" stroke-width="2.3"/><circle cx="12" cy="17" r="1.15" fill="currentColor" stroke="none"/>' },
  { i: 1, enum: 'CRITICA' as const, t: 'Crítica', sub: 'elemento que carga o sistema de seguridad', c: 'var(--risk-4)', svg: '<path d="M12 3.2l9.3 16.3H2.7z"/><path d="M12 9.5v5" stroke-width="2.3"/><circle cx="12" cy="17.6" r="1.15" fill="currentColor" stroke="none"/>' },
  { i: 2, enum: 'MODERADA' as const, t: 'Moderada', sub: 'daño funcional, sin riesgo directo', c: 'var(--risk-3)', svg: '<circle cx="12" cy="12" r="9"/><path d="M12 7.5v5.5" stroke-width="2.2"/><circle cx="12" cy="16.6" r="1.15" fill="currentColor" stroke="none"/>' },
  { i: 3, enum: 'MENOR' as const, t: 'Menor', sub: 'superficial o estético', c: 'var(--risk-2)', svg: '<circle cx="12" cy="12" r="9"/><path d="M12 11.2v5" stroke-width="2.2"/><circle cx="12" cy="7.8" r="1.15" fill="currentColor" stroke="none"/>' },
];

export const PROB_OPTS = [
  { i: 0, enum: 'BAJA' as const, t: 'Baja', c: 'var(--risk-2)', svg: '<rect x="3.5" y="13" width="4.5" height="7.5" rx="1" fill="currentColor" stroke="none"/><rect x="9.75" y="9" width="4.5" height="11.5" rx="1"/><rect x="16" y="4.5" width="4.5" height="16" rx="1"/>' },
  { i: 1, enum: 'MEDIA' as const, t: 'Media', c: 'var(--risk-3)', svg: '<rect x="3.5" y="13" width="4.5" height="7.5" rx="1" fill="currentColor" stroke="none"/><rect x="9.75" y="9" width="4.5" height="11.5" rx="1" fill="currentColor" stroke="none"/><rect x="16" y="4.5" width="4.5" height="16" rx="1"/>' },
  { i: 2, enum: 'ALTA' as const, t: 'Alta', c: 'var(--risk-5)', svg: '<rect x="3.5" y="13" width="4.5" height="7.5" rx="1" fill="currentColor" stroke="none"/><rect x="9.75" y="9" width="4.5" height="11.5" rx="1" fill="currentColor" stroke="none"/><rect x="16" y="4.5" width="4.5" height="16" rx="1" fill="currentColor" stroke="none"/>' },
];

/** Detalle vertical — solo se pide en nivel 4 (dictamen §2). */
export const VERTICALES = [
  { k: 'soporta_carga', t: 'El elemento soporta algo', d: 'Techo, equipo pesado o piso superior.' },
  { k: 'atraviesa_elemento', t: 'El daño atraviesa el elemento', d: 'Se ve por ambos lados.' },
  { k: 'deformacion_visible', t: 'Deformación visible a simple vista', d: 'Pandeo, flecha o desplome apreciable.' },
  { k: 'crecio_recientemente', t: 'Apareció o creció recientemente', d: 'Según personal del sitio o registros.' },
  { k: 'patron_repetido', t: 'Hay más elementos iguales afectados', d: 'Patrón repetido, no un caso aislado.' },
] as const;

export const SEGURIDAD_ITEMS = [
  { k: 'ats', t: 'Análisis de Trabajo Seguro (ATS) realizado', d: 'Peligros del área identificados y controlados.' },
  { k: 'epp', t: 'Equipo de protección personal (EPP) verificado', d: 'Casco, calzado, guantes y protección según zona.' },
  { k: 'permisos', t: 'Permisos de trabajo en altura / espacio confinado', d: 'Cubiertas, mezanines y pasillos de servicio.' },
  { k: 'electrico', t: 'Peligros eléctricos identificados', d: 'Al inspeccionar cerca de instalaciones electromecánicas.' },
] as const;

export function computarNivel(sev: number | null, prob: number | null, reglaDura: boolean): number | null {
  if (reglaDura) return 5;
  if (sev === null || prob === null) return null;
  return MATRIZ[sev][prob];
}

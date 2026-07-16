// Tipos TypeScript espejo del esquema (supabase/migrations/0001_esquema_inicial.sql)
// Fuente conceptual: docs/01-concepto-app.md (v0.6) + docs/04-criterio-captura-tier1.md

export type RolUsuario = 'INSPECTOR' | 'ADMINISTRACION' | 'DIRECCION_TECNICA' | 'GERENCIA';
export type TipoElemento = 'ESTRUCTURAL' | 'NO_ESTRUCTURAL';
/** Capturado en campo como "¿cómo lo detectaste?" (dictamen §8) */
export type OrigenHallazgo = 'NORMADO' | 'NO_NORMADO';
export type SeveridadRiesgo = 'INMINENTE' | 'CRITICA' | 'MODERADA' | 'MENOR';
export type ProbabilidadRiesgo = 'BAJA' | 'MEDIA' | 'ALTA';
export type EstadoInforme = 'BORRADOR' | 'EMITIDO';
export type NivelRiesgo = 1 | 2 | 3 | 4 | 5;

export interface Perfil {
  id: string;
  nombre: string;
  rol: RolUsuario;
  colegiatura_registro: string | null;
  es_profesional_competente: boolean;
  created_at: string;
}

export interface Proyecto {
  id: string;
  nombre: string;
  ubicacion: string | null;
  /** Referencias normativas opcionales (norma abierta) */
  categoria_riesgo_edificacion: 'I' | 'II' | 'III' | 'IV' | null;
  nivel_sismicidad: string | null;
  nivel_desempeno_objetivo: string | null;
  created_at: string;
}

export interface Modulo {
  id: string;
  proyecto_id: string;
  nombre: string;
  descripcion: string | null;
  created_at: string;
}

export interface Inspeccion {
  id: string;
  proyecto_id: string;
  modulo_id: string;
  inspector_id: string;
  tecnico_acompanante: string | null;
  fecha: string;
  hora_inicio: string | null;
  hora_fin: string | null;
  condiciones_clima_iluminacion: string | null;
  /** Checklist ATS/EPP — obligatorio antes del recorrido (S1) */
  checklist_seguridad: Record<string, boolean>;
  created_at: string;
}

/** Las 5 preguntas verticales que la app pide solo en nivel 4 (dictamen §2) */
export interface DetalleIngeniero {
  soporta_carga: boolean;
  atraviesa_elemento: boolean;
  deformacion_visible: boolean;
  crecio_recientemente: boolean;
  patron_repetido: boolean;
}

export interface Hallazgo {
  id: string;
  proyecto_id: string;
  inspeccion_id: string;
  numero: number;
  ubicacion: string;
  es_local_comercial: boolean;
  tipo_elemento: TipoElemento;
  tipo_estructural: string | null;
  categoria_no_estructural: string | null;
  /** El principal lo ordena la app por ranking técnico, no el orden de clic (dictamen §7) */
  sintoma_principal: string;
  sintomas: string[];
  medida_guiada: string | null;
  descripcion: string;
  origen: OrigenHallazgo;
  /** La ancla el ingeniero en gabinete (E5 / dictamen §8) */
  ref_norma: string | null;
  resultado_checklist: 'COMPLIANT' | 'NON_COMPLIANT' | 'NA' | null;
  nivel_riesgo: NivelRiesgo;
  severidad: SeveridadRiesgo | null;
  probabilidad: ProbabilidadRiesgo | null;
  regla_dura: boolean;
  riesgo_justificacion: string | null;
  requiere_analisis_mayor: boolean;
  detalle_ingeniero: DetalleIngeniero | null;
  responsable_sugerido: string | null;
  /** Recomendación del entregable — la app no lo vigila (frontera v0.5) */
  plazo_sugerido: string | null;
  created_at: string;
}

export interface Foto {
  id: string;
  hallazgo_id: string;
  storage_path: string;
  geolocalizacion: { lat: number; lng: number } | null;
  tomada_en: string;
}

export interface Medicion {
  id: string;
  hallazgo_id: string;
  tipo: string;
  valor: number | null;
  unidad: string | null;
  fecha: string;
}

export interface ElementoNoEvaluado {
  id: string;
  inspeccion_id: string;
  descripcion: string;
  motivo: string;
  medio_intentado: string;
  created_at: string;
}

export interface Informe {
  id: string;
  inspeccion_id: string;
  estado: EstadoInforme;
  emitido_por: string | null;
  colegiatura_registro: string | null;
  sello_tiempo: string | null;
  resumen_por_nivel: Record<string, number> | null;
  /** Compliance B (v0.6) */
  declaracion_alcance: string | null;
  /** Compliance A (v0.6): matriz de seguimiento exportable */
  matriz_seguimiento_path: string | null;
  entregado_a: string | null;
  fecha_entrega: string | null;
  created_at: string;
}

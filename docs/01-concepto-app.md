# Concepto y especificación — App de Inspección y Presentación de Resultados

> **Nombre de trabajo:** SEK Estructuras *(tentativo)*
> **Producto:** Herramienta independiente para **ejecutar inspecciones y entregar resultados**. Propiedad de su creador.
> **Filosofía:** 80/20 · *menos es más* · **norma abierta** · **la app entrega y se detiene**.
> **Estado:** Documento de concepto **v0.6** — frontera de alcance + puente de compliance.
> **Fecha:** 2026-07-16

---

## 📖 Cómo leer este documento

> - **Negrita** = adición de la revisión de tres perfiles, con código: **E#** (estructuralista), **S#** (salud ocupacional), **U#** (apps/UX).
> - *Cursiva* = énfasis.
> - **Novedad v0.5:** se fijó la **frontera de alcance**. La app cubre inspección + presentación de resultados; todo el seguimiento posterior a la entrega (reparación, cierre, verificación) queda **fuera**. Detalle en [§2](#2-frontera-de-alcance-lo-que-la-app-hace-y-lo-que-no) y [§13](#13-trazabilidad-de-cambios).

---

## 1. Principio rector (el filtro de todo)

**El 20% que entrega el 80% del valor:**

```
   Detectar un hallazgo  →  Clasificar su riesgo (1–5)  →  Entregar los resultados
                                                            (matriz + evidencia +
                                                             responsable + plazo sugerido)
```

La app cumple su función cuando pone los resultados **en blanco y negro, en manos del encargado**. Lo que ese encargado haga después —cotizar, avalar, reparar, pagar— es **seguimiento externo**. La app no se queda esperando a ver qué pasó.

Tres reglas de diseño:
- **Menos es más:** cada pantalla justifica su existencia contra ese núcleo.
- **El riesgo es el idioma universal**, no la norma.
- **La app entrega y se detiene.** No gestiona la reparación.

---

## 2. Frontera de alcance (lo que la app hace y lo que NO)

> **Novedad v0.5 — la sección más importante.** Define de qué responde el producto y de qué no.

| ✅ DENTRO — Inspección + presentación de resultados | ❌ FUERA — Seguimiento de la reparación |
|---|---|
| Planificar y ejecutar la inspección | Que un proveedor evalúe el hallazgo |
| Detectar y describir hallazgos (normados y no normados) | Cotizaciones |
| Clasificar el nivel de riesgo (1–5) | Aval de compra / presupuesto |
| Evidencia fotográfica | Diseño/aval de la solución técnica |
| **Registrar limitaciones y elementos NO evaluados** | Ejecución de la reparación |
| Acción inmediata en campo (nivel 5) | Recepción y pago |
| Armar la matriz y **generar el entregable/informe** | **Cierre / verificación de que se reparó** |
| Asignar responsable y plazo *sugerido* | Monitoreo en el tiempo de hallazgos "abiertos" |
| Entregar y dejar constancia de la entrega | Aprobación de remodelaciones · Gantt de mantenimiento |

**Reinspección:** no es "seguimiento". Es simplemente **ejecutar una inspección nueva** — algo que la app hace de forma natural. Cada inspección es un entregable con fecha propia.

**Puente de compliance (v0.6):** la frontera se mantiene, pero el entregable **arma la mano de quien sigue**: incluye una **matriz de seguimiento pre-llenada** (columnas de estado, cierre y evidencia vacías, listas para completar a mano) y una **declaración de alcance** que dice qué etapas cubre el informe y cuáles quedan a cargo del receptor. La app entrega y se detiene — pero entrega completo.

---

## 3. El núcleo del producto

### 3.1 La columna vertebral

**Planificar inspección → Capturar hallazgos (riesgo + evidencia + limitaciones) → Generar y entregar el informe/matriz**

### 3.2 Dos orígenes de hallazgo — **norma abierta**

Un hallazgo **no requiere una norma detrás** para entrar al sistema:

| Origen | Qué es | Norma |
|---|---|---|
| **Normado** | Surge de una lista de verificación o estándar. | Se ancla a la referencia. |
| **No normado (riesgo emergente)** | El criterio profesional detecta un peligro que ninguna norma cubre. | No aplica. |

Ambos reciben nivel de riesgo 1–5, foto y entran al informe. **La norma es un atributo opcional, no una condición.**

---

## 4. Problema que resuelve

Hoy la inspección vive en Word y tablas estáticas: la matriz se llena a mano, la evidencia se dispersa, las limitaciones no quedan registradas y el inspector transcribe todo al volver a la oficina. El entregable tarda y pierde fuerza probatoria.

La app convierte la inspección en un flujo de captura en campo que produce un **entregable trazable y con respaldo legal** en el momento.

---

## 5. Terminología — **(E2)**

| Término | Qué es | Valores |
|---|---|---|
| **Nivel de riesgo del hallazgo** | Priorización de cada hallazgo. Idioma universal. | 1 a 5 |
| **Origen del hallazgo** | Si nace de una norma o del criterio profesional. | Normado / No normado |
| **Tipo de elemento** | Naturaleza del elemento. | Estructural / No estructural |
| **Categoría (no estructural)** | Una de las 11 familias. | 11 categorías |
| **Elemento no evaluado** | Lo que no se pudo inspeccionar, con su motivo y el medio intentado. | — |
| **Entregable / Informe** | El resultado que se pone en manos del encargado. | Borrador / Emitido |

---

## 6. Usuarios y roles

| Rol | Qué hace |
|---|---|
| **Inspector** (profesional competente) | Ejecuta la inspección, registra hallazgos, clasifica riesgo, firma el entregable. |
| **Administración / encargado** | Recibe el entregable. Coordina accesos durante la inspección. |
| **Dirección técnica** (opcional) | Apoya criterios de clasificación / custodia los entregables. |

> El *entregable firmado* lleva la **colegiatura/registro del profesional competente y sello de tiempo inmutable (E8)**. Lo que el encargado haga con él es externo a la app.

---

## 7. Alcance del MVP

### MVP = capturar la inspección y producir el entregable

- Proyectos y su división en módulos/zonas.
- **Checklist de seguridad del inspector (ATS + EPP) antes del recorrido (S1).**
- Registro de hallazgo **(normado o no normado)**: ubicación, tipo, categoría, descripción, foto.
- **Asistente guiado que calcula el riesgo 1–5 (S2, U6).**
- **Registro de limitaciones y elementos no evaluados (medio utilizado: dron/binoculares/pértiga).**
- Acción inmediata en campo para nivel 5 (**protocolo + contactos, S3**).
- Matriz de hallazgos (**tarjetas en móvil / tabla en web, U4**).
- **Generación del entregable/informe firmado (PDF/Excel) — el clímax del producto (U7).**
- **Matriz de seguimiento exportable anexa al informe** (pre-llenada con hallazgos, niveles y plazos; columnas de estado/cierre/evidencia vacías para que el receptor continúe a mano) — *puente de compliance A (v0.6)*.
- **Declaración de alcance dentro del informe** (qué etapas cubre y cuáles quedan a cargo del receptor) — *puente de compliance B (v0.6)*.
- Constancia de entrega (a quién, cuándo).

### Capas posteriores (después de validar el núcleo)
- **Fase 2:** PWA con **offline (U1)**, checklists de planificación dentro de la app, fotos con geolocalización, **dictado por voz + autoguardado (U5)**.
- **Fase 3:** plantillas de informe avanzadas, comparación entre inspecciones (reinspección), catálogos de norma como referencia.

---

## 8. Flujo funcional

```
1. PLANIFICAR
   ├─ Crear proyecto → dividir en módulos
   └─ [S1] Checklist de trabajo seguro del inspector (ATS + EPP)

2. INSPECCIONAR (campo)
   ├─ Registrar hallazgo (ubicación, tipo, categoría, descripción, foto)
   ├─ Origen: normado / no normado (riesgo emergente)
   ├─ [U6] Asistente guiado de riesgo → calcula el nivel 1–5
   ├─ [E4] Mediciones estructuradas (opcional)
   ├─ Registrar limitaciones / elementos NO evaluados
   └─ Nivel 5 → [S3] acción inmediata + contactos

3. ENTREGAR RESULTADOS   ← la app termina aquí
   ├─ Matriz de hallazgos (filtros por nivel)
   ├─ Generar informe firmado (colegiatura + sello de tiempo)
   └─ Constancia de entrega al encargado
```

---

## 9. Asistente guiado de riesgo (1–5) — **(S2, U6)**

Convierte el paso más subjetivo en 3 preguntas que **calculan** el nivel con una matriz severidad × probabilidad. Aplica igual a hallazgos normados y no normados.

1. **Consecuencia sobre la vida humana** (¿colapso, gas, contra incendios?).
2. **Afectación a la continuidad de la operación.**
3. **Probabilidad de evolución/agravamiento.**

| Severidad ↓ / Probabilidad → | Baja | Media | Alta |
|---|---|---|---|
| **Inminente a la vida** | 4 | 5 | 5 |
| **Crítica** | 3 | 4 | 4 |
| **Moderada** | 2 | 3 | 3 |
| **Menor** | 1 | 1 | 2 |

> Regla dura: gas, contra incendios o riesgo de colapso → **nivel 5** siempre. El inspector puede ajustar con justificación registrada.

---

## 10. Modelo de datos (borrador)

```
Proyecto        id (UUID), nombre, ubicación
Módulo          id (UUID), proyecto_id, nombre/zona
Inspección      id (UUID), proyecto_id, módulo_id, inspector_id, fecha,
                condiciones_clima_iluminación,
                **checklist_seguridad_inspector (ATS/EPP) (S1)**

Hallazgo   ← entidad central
   id (UUID), número, inspección_id, módulo_id,
   ubicación, es_local_comercial (bool),
   tipo_elemento (ESTRUCTURAL | NO_ESTRUCTURAL),
   **tipo_estructural (columna|viga|muro|marco|conexión|diafragma|cimentación) — opcional (E3)**,
   categoría_no_estructural (1 de 11) — opcional,
   descripción_condición,
   origen (NORMADO | NO_NORMADO),
   ref_norma / resultado_checklist — SOLO si NORMADO (E1, E5),
   nivel_riesgo (1–5)  ← SIEMPRE,
   **riesgo_severidad, riesgo_probabilidad, riesgo_justificación (S2)**,
   **requiere_análisis_mayor_nivel (bool) (E6)**,
   responsable_sugerido, plazo_sugerido (calculado según nivel),
   fecha_registro

Foto            id, hallazgo_id, url, geolocalización, timestamp
                **→ inmutable, cadena de custodia (S6)**
**Medición (E4)** id, hallazgo_id, tipo (fisura_mm|desplome|deflexión|corrosión…), valor, fecha

ElementoNoEvaluado   ← nuevo (valor legal / alcance real)
   id, inspección_id, módulo_id (opcional),
   descripción (qué no se pudo evaluar),
   motivo (cielo/acabado | acceso | iluminación | sin registro | otro),
   medio_intentado (dron | binoculares | pértiga | zoom | ninguno)

Informe (Entregable)   ← el clímax del producto
   id, inspección_id, fecha_emisión,
   profesional_id, **colegiatura_registro, sello_tiempo (E8)**,
   resumen_por_nivel, formato (PDF | EXCEL),
   estado (BORRADOR | EMITIDO),
   constancia_entrega (a_quién, fecha)

Usuario         id (UUID), nombre, rol, colegiatura/registro, es_profesional_competente
```

> **(U2)** IDs UUID en cliente + timestamps = modelo listo para el offline de la Fase 2 sin reescribir.
> **Nota:** no hay entidades de cierre, monitoreo ni escalamiento — quedan **fuera de alcance** (§2).

---

## 11. Reglas de negocio (la columna legal)

| Regla | Comportamiento |
|---|---|
| *Todo hallazgo* | ≥ 1 foto + nivel de riesgo asignado. No se guarda incompleto. **La norma NO es obligatoria; el riesgo sí.** |
| *Nivel 5* = inminente a la vida | **Acción inmediata en campo** (acordonar, cerrar válvulas) + **protocolo de emergencia con contactos (S3)**. En el informe: mitigación sugerida ≤ 72 h. |
| *Plazos* | `plazo_sugerido` calculado automáticamente por nivel. **Es una recomendación del entregable, no algo que la app vigile.** |
| **Limitaciones** | Dejar constancia de todo elemento no evaluado, su motivo y el medio intentado. Delimita el alcance real de la inspección. |
| *Entregable* | Firmado por profesional competente (colegiatura + sello de tiempo). Evidencia con **cadena de custodia inmutable (S6)**. |

---

## 12. UX, arquitectura y seguridad (lo esencial)

- **(U1) PWA única** (web + móvil en un solo código) → **(U2)** modelo sync-ready para offline en Fase 2.
- **(U3)** El color de riesgo nunca va solo: **color + número + ícono** (accesibilidad, sol de campo).
- **(U9)** Fotos: compresión en cliente + subida directa a la nube (URLs firmadas); original conservado como evidencia.
- **(S6)** Log inmutable de la evidencia y del entregable — defendible ante instancias legales/aseguradoras.
- **(S1) Seguridad del inspector (eje SSO):** checklist ATS, EPP, permisos de altura/espacio confinado, peligros eléctricos.
- Idioma español (configurable por región).

---

## 13. Trazabilidad de cambios

**v0.5 → v0.6 (puente de compliance, tras la auditoría contra los documentos originales):**
- **A adoptada:** matriz de seguimiento exportable anexa al informe (el receptor completa a mano las etapas que la app no gestiona).
- **B adoptada:** declaración de alcance dentro del informe.
- **C anotada** en el plan técnico: módulo "Seguimiento" activable como opción comercial futura.
- Origen: `docs/03-compliance-origen.md` — la frontera v0.5 dejaba sin soporte monitoreo/cierre para quien ejecute el procedimiento original completo.

**v0.4 → v0.5 (frontera de alcance):**
- Definida la **frontera**: la app cubre *inspección + presentación de resultados*; el seguimiento de la reparación queda **fuera** (§2).
- **Cierre eliminado por completo** (foto antes/después, visto bueno, verificación en sitio) → fuera de alcance.
- **Monitoreo trimestral y escalamiento (S4, S5) → fuera** (son seguimiento posterior a la entrega).
- **El entregable/informe firmado sube al MVP** (antes Fase 3): es el clímax del producto.
- **Elementos no evaluados / limitaciones → al MVP** (valor legal: define el alcance real).
- Reinspección reencuadrada como *ejecutar una inspección nueva*, no como seguimiento.

**v0.3 → v0.4:** Pareto 80/20 + norma abierta (hallazgo normado / no normado).
**v0.2 → v0.3:** base cero — eliminadas referencias a organizaciones y nombres propios de terceros.

**Adiciones vigentes de la revisión de tres perfiles:**

| | |
|---|---|
| **E1** Checklist normado ≠ nivel de riesgo | **S1** Seguridad del inspector (ATS/EPP) |
| **E2** Terminología sin colisiones | **S2** Matriz severidad × probabilidad |
| **E3** Taxonomía de elementos estructurales | **S3** Acción inmediata / protocolo nivel 5 |
| **E4** Mediciones estructuradas | **S6** Cadena de custodia inmutable |
| **E5** Trazabilidad a norma (si aplica) | **U1** PWA · **U2** sync-ready · **U3** color accesible |
| **E6** Bandera "análisis de mayor nivel" | **U4** tarjetas/tabla · **U5** voz + autoguardado |
| **E8** Colegiatura + sello en el entregable | **U6** asistente de riesgo · **U7** informe · **U9** fotos a la nube |

> *Retiradas de alcance en v0.5:* **S4** (escalamiento) y **S5** (dashboard de vencidos) — pertenecen al seguimiento posterior a la entrega.

---

## 14. Decisiones pendientes

1. Nombre definitivo y branding.
2. ¿Multi-proyecto (multi-tenant) desde el inicio o un proyecto?
3. Subcategorías no estructurales: ¿catálogo o texto libre en el MVP?
4. Formato del entregable: ¿plantilla PDF fija o configurable?
5. Firma del informe: ¿firma digital formal o registro + colegiatura + sello?
6. Stack tecnológico y hosting.
7. **(S2)** Calibración de la matriz severidad × probabilidad.

---

## 15. Próximo paso propuesto

**Prototipo visual navegable** del núcleo (§3): captura de hallazgo (normado / no normado) con asistente de riesgo, registro de elementos no evaluados, matriz, y **generación del entregable firmado**. Validar la columna vertebral antes de escribir código.

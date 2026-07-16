# Auditoría de compliance — Producto actual vs. documentos originales

> **Qué compara:** los requisitos del procedimiento original de inspecciones estructurales (procedimiento + guía práctica de campo + formato de campo + 2 infografías) contra el **producto actual** (concepto v0.5 + prototipo navegable).
> **Para qué sirve:** saber con certeza qué se cumple, qué se cumple mejor que el original, qué se excluyó **a propósito** (con decisión documentada) y qué queda descubierto si alguien quisiera ejecutar el procedimiento original completo con esta herramienta.
> **Fecha:** 2026-07-16

---

## Leyenda de estados

| Estado | Significado |
|---|---|
| ✅ **Cumple** | Está en el MVP tal como lo pide el original. |
| ⭐ **Mejora** | Está en el MVP y **supera** lo que pedía el original. |
| 🔶 **Parcial** | Cubierto en parte; se indica qué falta. |
| 📘 **Referencia** | Presente como referencia opcional (decisión "norma abierta", v0.4). |
| ⏭ **Fase 2/3** | Planificado, no en el MVP. |
| 🚫 **Excluido** | Fuera del producto **por decisión documentada** (frontera v0.5). |
| ⚠️ **Pendiente** | Requiere una decisión o calibración aún abierta. |

---

## 1. Etapa de planificación

| # | Requisito del original | Estado | Dónde / nota |
|---|---|---|---|
| P1 | División del edificio en módulos | ✅ | MVP: Proyecto → Módulos. |
| P2 | Documentación constructiva y electromecánica disponible | ⏭ Fase 2 | Checklist de planificación dentro de la app. |
| P3 | Reconocimiento previo con administración | ⏭ Fase 2 | Ítem del checklist de planificación. |
| P4 | Cronograma de inspección + permisos a áreas privadas | ⏭ Fase 2 | Ídem. |
| P5 | Comunicado previo al arranque | ⏭ Fase 2 | Ídem. |
| P6 | Reuniones de coordinación previas | 🚫 Excluido | Proceso humano entre personas; la app no lo gestiona (frontera v0.5). |
| P7 | Categoría de riesgo de la edificación (I–IV, Tabla 1.5-1) | 📘 Referencia | Campo opcional del Proyecto; no se automatiza (norma abierta). |
| P8 | Nivel de desempeño objetivo (Cuadro 2-1) | 📘 Referencia | Ídem. |
| P9 | Nivel de sismicidad | 📘 Referencia | Ídem. |
| P10 | Selección de listas de verificación (Tabla 4-7) | 📘 Referencia | Se muestran como apoyo; no son requisito para operar. |
| P11 | *(No estaba en el original como requisito de app)* Seguridad del propio inspector | ⭐ Mejora | **Checklist ATS + EPP obligatorio antes del recorrido** — adición S1; el original no protegía al inspector. |

## 2. Inspección en campo

| # | Requisito del original | Estado | Dónde / nota |
|---|---|---|---|
| C1 | Checklist de herramientas (linterna, cinta, dron…) | ⏭ Fase 2 | Checklist dentro de la app. |
| C2 | Acompañamiento de técnico de mantenimiento | ✅ | Campo `técnico_acompañante` en Inspección. |
| C3 | Buscar patrones de deterioro (Tabla 4-1) | 📘 Referencia | `ref_patrón_deterioro` opcional en el hallazgo. |
| C4 | Revisar áreas comunes **y** privativas (locales) | ✅ | Campo `es_local_comercial` en el hallazgo. |
| C5 | Fotografía de **cada** hallazgo | ✅ | Regla dura: no se guarda hallazgo sin foto y sin nivel. |
| C6 | Condiciones de clima / iluminación registradas | ✅ | Campo de la Inspección (del formato de campo original). |
| C7 | Reuniones de seguimiento con minutas | 🚫 Excluido | Frontera v0.5: coordinación humana, externa a la app. |

## 3. Registro del hallazgo — datos mínimos obligatorios

| # | Requisito del original | Estado | Dónde / nota |
|---|---|---|---|
| R1 | Ubicación exacta (local vs. área común) | ✅ | Campo obligatorio. |
| R2 | Categoría estructural / no estructural | ✅ | Tiles grandes en el prototipo. |
| R3 | Las 11 categorías no estructurales | ✅ | Catálogo completo en el selector. |
| R4 | Subcategoría según la norma | ⚠️ Pendiente | Decisión abierta #3: ¿catálogo completo o texto libre en el MVP? |
| R5 | Descripción de la condición | ⭐ Mejora | Obligatoria **y bloquea el avance** si falta (el original no lo forzaba). |
| R6 | ≥ 1 fotografía | ✅ | Regla dura. |
| R7 | Nivel de riesgo 1–5 asignado | ⭐ Mejora | El asistente lo **calcula** (severidad × probabilidad); el original lo dejaba al criterio con 3 criterios sueltos. |
| R8 | *(Adición)* Hallazgos **no normados** | ⭐ Mejora | El original solo contemplaba lo derivado de listas; el producto admite riesgo emergente sin norma. |

## 4. Clasificación de riesgo y plazos

| # | Requisito del original | Estado | Dónde / nota |
|---|---|---|---|
| N1 | Criterios: vida humana, operación, probabilidad | ✅ | Son las 3 preguntas del asistente. |
| N2 | Tabla de referencia oficial de Ingeniería | ⚠️ Pendiente | La matriz severidad × probabilidad es borrador; falta calibrarla (decisión #7 del concepto). |
| N3 | Nivel 5: mitigación ≤ 72 h + acción inmediata (acordonar, cerrar válvulas) | 🔶 Parcial | La **acción inmediata en campo sí** (protocolo + contactos, S3); el plazo va como **recomendación en el informe**, la app no lo vigila (frontera v0.5). |
| N4 | Nivel 4: ≤ 3 meses + reporte inmediato a Ingeniería | 🔶 Parcial | Plazo sugerido calculado ✅; la **vigilancia** del plazo quedó fuera. |
| N5 | Niveles 2–3: 3 meses–1 año | ✅ | Plazo sugerido automático. |
| N6 | Nivel 1: según programación | ✅ | Ídem. |
| N7 | Regla: gas / contra incendios / colapso = nivel máximo | ⭐ Mejora | Regla dura **codificada** en el asistente (checkbox → 5 automático). |

## 5. Matriz de hallazgos — campos mínimos del original

| Campo pedido por el original | Estado |
|---|---|
| Fecha de registro | ✅ |
| Número de hallazgo | ✅ |
| Ubicación | ✅ |
| Categoría y subcategoría | ✅ / ⚠️ (subcategoría pendiente) |
| Nivel de riesgo | ✅ |
| Responsable de la atención | 🔶 Como **responsable sugerido** en el entregable. |
| Plazo de atención | 🔶 Como **plazo sugerido** (la app no lo persigue). |
| **Estado (abierto / en proceso / cerrado)** | 🚫 Excluido — frontera v0.5. |
| **Fecha de cierre** | 🚫 Excluido. |
| **Evidencia de cierre (foto antes/después)** | 🚫 Excluido. |

## 6. Monitoreo, cierre y seguimiento

| # | Requisito del original | Estado | Nota |
|---|---|---|---|
| S1 | Monitoreo trimestral (niveles 1–3) con foto comparativa | 🚫 Excluido | Frontera v0.5: seguimiento posterior a la entrega. |
| S2 | Reportar agravamiento a profesional competente | 🚫 Excluido | Ídem. |
| S3 | Cierre: foto antes/después + visto bueno | 🚫 Excluido | El **visto bueno se re-aplicó al informe** (firma + colegiatura + sello), no al cierre. |
| S4 | Verificación de cierre EN SITIO (niveles 4–5) | 🚫 Excluido | Ídem. |
| S5 | Correo a gerencia si no hay presupuesto (riesgo aceptado) | 🚫 Excluido | Se había diseñado (Escalamiento, S4 de la revisión) y se retiró en v0.5. |
| S6 | Gantt de mantenimiento | 🚫 Excluido | Frontera v0.5. |
| S7 | Aprobación de remodelaciones en locales | 🚫 Excluido | Proceso adyacente, no de inspección. |
| S8 | Locales: carta del comité, 3 meses, condiciona renovación | ⏭ Fase 3 | Módulo de locales comerciales. |
| S9 | Reinspección ordinaria (5 años) y extraordinaria | 🔶 Parcial | Reencuadrada como "nueva inspección" ✅ conceptual; **sin recordatorio automático** y sin umbral de sismo definido (⚠️ decisión #8). |

## 7. Informe y limitaciones

| # | Requisito del original | Estado | Nota |
|---|---|---|---|
| I1 | Informe detallado con todos los hallazgos | ⭐ Mejora | Es el **clímax** del producto (entregable firmado con sello de tiempo y constancia de entrega). |
| I2 | Documentar limitaciones (planos desactualizados, cielos, accesos…) | ⭐ Mejora | Entidad propia `ElementoNoEvaluado` con motivo y **medio intentado** (dron/binoculares/pértiga) — en el MVP. |
| I3 | Dejar constancia del medio utilizado y elementos no evaluados | ⭐ Mejora | Ídem — el original lo pedía en prosa; el producto lo estructura. |
| I4 | Roles y responsabilidades (inspector, administración, ingeniería, gerencia) | ✅ | Definidos con permisos; gerencia quedó con rol reducido por la frontera. |

---

## 8. Balance numérico

Sobre **41 requisitos** identificados en los documentos originales:

| Estado | Cantidad | Lectura |
|---|---|---|
| ✅ Cumple | 13 | El núcleo de inspección y registro está íntegro. |
| ⭐ Mejora | 7 | Descripción forzada, riesgo calculado, no normados, seguridad del inspector, no evaluados estructurados, informe firmado. |
| 🔶 Parcial | 5 | Sobre todo: plazos como *sugerencia* en vez de *vigilancia*. |
| 📘 Referencia | 5 | Todo lo atado a la norma específica (decisión "norma abierta"). |
| ⏭ Fase 2/3 | 6 | Checklists de planificación/herramientas, locales. |
| 🚫 Excluido | 10 | **Todo el bloque de seguimiento/cierre** — decisión frontera v0.5. |
| ⚠️ Pendiente | 3 | Subcategorías, calibración de matriz, umbral de sismo. |

**Veredicto:** el producto cubre **completa o mejoradamente las etapas de planificación esencial, campo, análisis y presentación de resultados** del procedimiento original. Las exclusiones **no son olvidos**: son la frontera decidida en v0.5 ("la app entrega y se detiene"). Pero eso deja un hecho objetivo sobre la mesa:

> ⚠️ **Si un usuario quisiera ejecutar el procedimiento original completo apoyándose solo en esta herramienta, las etapas de monitoreo trimestral, cierre con evidencia y verificación en sitio quedarían sin soporte.** Hoy tendría que resolverlas por fuera (papel, Excel propio, otro sistema).

---

## 9. Propuestas (respuesta a la brecha)

Tres opciones **compatibles con la frontera v0.5** — ninguna reintroduce el seguimiento a la app:

### Propuesta A — Puente de seguimiento en el entregable *(recomendada)*
Al emitir el informe, la app genera **además** una **matriz de seguimiento lista para usar** (Excel/hoja imprimible) con las columnas que el procedimiento original exige y que la app no gestiona: *estado, fecha de cierre, foto antes/después (S/N), verificación en sitio (S/N), visto bueno* — pre-llenada con los hallazgos, niveles y plazos.
**Efecto:** la app sigue entregando y deteniéndose, pero el encargado recibe la herramienta exacta para completar el procedimiento original a mano. Cierra la brecha con costo mínimo y sin romper la frontera.

### Propuesta B — Declaración de alcance en el informe *(costo casi cero)*
El PDF incluye una sección fija: *"Este informe cubre las etapas de inspección, clasificación y presentación de resultados. El monitoreo, cierre y verificación posteriores son responsabilidad del receptor."*
**Efecto:** compliance declarativo — nadie puede asumir que la app cubría lo que no cubre. Protege legalmente al inspector y al creador de la herramienta.

### Propuesta C — Módulo "Seguimiento" activable *(futuro comercial, no MVP)*
Dejar anotado en el plan técnico que el bloque excluido (estado/monitoreo/cierre) puede ofrecerse después como **módulo opcional** para clientes que sí quieran el ciclo completo dentro de la app. El modelo de datos ya lo soporta (las entidades se diseñaron en v0.2 y están documentadas).
**Efecto:** la exclusión de hoy se convierte en oportunidad de venta de mañana, sin comprometer el MVP.

### Pendientes que igual hay que cerrar (independientes de A/B/C)
1. **Subcategorías** (R4): definir catálogo o texto libre.
2. **Calibración de la matriz** severidad × probabilidad (N2) con un profesional competente.
3. **Umbral de "sismo significativo"** (S9) para reinspección extraordinaria.

---

*Documento generado como auditoría de lectura, comprensión y cumplimiento del material original. Las referencias a los documentos fuente se mantienen anónimas conforme a la decisión "base cero" (v0.3).*

# Concepto y especificación — App de Inspecciones y Gestión de Hallazgos

> **Nombre de trabajo:** SEK Estructuras *(tentativo)*
> **Producto:** Herramienta independiente de inspección y gestión legal/logística de hallazgos. Propiedad de su creador.
> **Filosofía:** 80/20 · *menos es más* · **norma abierta** (la norma valida donde aplica; el riesgo manda siempre).
> **Estado:** Documento de concepto **v0.4** — enfocado al núcleo de valor.
> **Fecha:** 2026-07-15

---

## 📖 Cómo leer este documento

> - **Negrita** = contenido agregado en la revisión de los tres perfiles, con su código de origen: **E#** (estructuralista), **S#** (salud ocupacional), **U#** (apps/UX).
> - *Cursiva* = énfasis.
> - **Novedad v0.4:** se aplicó Pareto 80/20 para dejar el producto en su núcleo de valor, y se abrió el modelo para que **no dependa de una norma específica**. Detalle en [§15](#15-trazabilidad-de-cambios).

---

## 1. Principio rector (el filtro de todo)

**El 20% que entrega el 80% del valor** es esto, y solo esto:

```
   Detectar un hallazgo  →  Ponerle un nivel de riesgo (1–5)  →  Cerrarlo con evidencia trazable
                                        │
                              plazos automáticos + alertas
```

Todo lo demás (checklists de norma, sismicidad, taxonomías, cronogramas, módulos de locales…) **es una capa que se apoya sobre ese núcleo, no lo reemplaza.** Si algo no fortalece esa columna vertebral, no entra al MVP.

Tres reglas de diseño derivadas:
- **Menos es más:** cada pantalla justifica su existencia contra el núcleo. Ante la duda, se deja afuera.
- **El riesgo es el idioma universal**, no la norma. La escala 1–5 aplica a cualquier hallazgo.
- **Puerta abierta:** el sistema debe registrar tanto lo normado como lo *no normado pero peligroso*.

---

## 2. El núcleo del producto

### 2.1 La columna vertebral (siempre presente)

Todo hallazgo, sea del tipo que sea, recorre el mismo ciclo:

**Registro (ubicación + foto) → Riesgo 1–5 → Seguimiento (plazos) → Cierre con evidencia → Auditoría trazable**

### 2.2 Dos orígenes de hallazgo — **norma abierta**

> **(Novedad v0.4)** Un hallazgo **no requiere una norma detrás** para entrar al sistema. Se distinguen dos orígenes, ambos con el ciclo completo:

| Origen | Qué es | Validación de norma |
|---|---|---|
| **Normado** | Surge de una lista de verificación o estándar (ej. un ítem que resulta *Non-Compliant*). | Sí — se ancla a la referencia normativa. |
| **No normado (riesgo emergente)** | El criterio profesional detecta un peligro que ninguna norma cubre, pero que igual implica riesgo. | No aplica — el juicio del inspector es suficiente para abrirlo. |

Lo que **nunca** cambia entre ambos: se le asigna nivel de riesgo 1–5, se documenta con foto, se le calculan plazos y se cierra con evidencia. **La norma es un atributo opcional del hallazgo, no una condición para registrarlo.**

---

## 3. Problema que resuelve

Hoy muchos procesos de inspección viven en Word y tablas estáticas: la matriz se llena a mano y se pierde entre versiones, los plazos dependen de que alguien los recuerde, la evidencia fotográfica se dispersa y no hay trazabilidad ni visibilidad en tiempo real. El inspector transcribe todo a mano al volver a la oficina.

La app convierte ese proceso en un sistema vivo, con respaldo legal y trazable.

---

## 4. Terminología (evitar confusiones) — **(E2)**

| Término | Qué es | Valores |
|---|---|---|
| **Nivel de riesgo del hallazgo** | Priorización de cada hallazgo. El idioma universal del sistema. | 1 a 5 |
| **Origen del hallazgo** | Si nace de una norma o del criterio profesional. | Normado / No normado |
| **Tipo de elemento** | Naturaleza del elemento. | Estructural / No estructural |
| **Categoría (no estructural)** | Una de las 11 familias de elementos no estructurales. | 11 categorías |
| **Categoría de riesgo de la edificación** | Clasificación del edificio (referencia opcional: ASCE 7-16, Tabla 1.5-1). | I–IV |
| **Resultado de checklist** | Cumplimiento de un ítem normado (solo si el hallazgo es normado). | C / NC / N-A |

---

## 5. Usuarios y roles

| Rol | Qué hace | Plataforma |
|---|---|---|
| **Inspector** (profesional competente) | Registra hallazgos, clasifica riesgo, verifica cierres, da visto bueno. | Móvil |
| **Administración** | Coordina accesos, monitoreo, cierres. | Web + Móvil |
| **Dirección técnica** | Avala soluciones, custodia la matriz. | Web |
| **Gerencia** | Aprueba presupuestos, atiende escalamientos. | Web (dashboard) |

> El *cierre* y el *visto bueno* están reservados a roles habilitados (regla dura). **El visto bueno registra la colegiatura/registro profesional y queda con sello de tiempo inmutable (E8).**

---

## 6. Alcance

### MVP = el núcleo (§1), nada más

- Proyectos y su división en módulos/zonas.
- **Checklist de seguridad del inspector (ATS + EPP) antes del recorrido (S1).**
- Registro de hallazgo **(normado o no normado)** con ubicación + foto.
- **Asistente guiado que calcula el riesgo 1–5 (S2, U6).**
- Matriz de hallazgos (**tarjetas en móvil / tabla en web — U4**) con filtros por nivel y estado.
- Plazos automáticos + **dashboard de vencidos críticos (S5).**
- Cierre con evidencia obligatoria (foto antes/después + visto bueno; verificación en sitio niveles 4–5).

### Capas posteriores (después de validar el núcleo)

- **Fase 2 — Campo robusto:** PWA con **offline (U1)**, checklists dentro de la app, fotos con geolocalización, **dictado por voz + autoguardado (U5)**.
- **Fase 3 — Ciclo completo:** monitoreo trimestral con medición comparativa, reinspección (ordinaria 5 años + gatillos extraordinarios), cronograma de mantenimiento, módulo de locales comerciales, **informe PDF firmado (U7)**, exportación de la matriz, **bandera "requiere análisis de mayor nivel" (E6)**.

> Todo lo relacionado con normas específicas (listas de verificación, sismicidad, desempeño) se trata como **referencia opcional adaptable**, nunca como requisito para operar.

---

## 7. Asistente guiado de riesgo (1–5) — **(S2, U6)**

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

## 8. Modelo de datos (borrador, centrado en el núcleo)

```
Proyecto           id (UUID), nombre, ubicación, [datos de norma: opcionales]
Módulo             id (UUID), proyecto_id, nombre/zona
Inspección         id (UUID), proyecto_id, módulo_id, inspector_id, fecha,
                   **checklist_seguridad_inspector (ATS/EPP) (S1)**

Hallazgo   ← entidad central
   id (UUID), número, inspección_id, módulo_id,
   ubicación, es_local_comercial (bool),
   tipo_elemento (ESTRUCTURAL | NO_ESTRUCTURAL),
   **tipo_estructural (columna|viga|muro|marco|conexión|diafragma|cimentación) — opcional (E3)**,
   categoría_no_estructural (1 de 11) — opcional,
   descripción_condición,
   origen (NORMADO | NO_NORMADO),                        ← norma abierta (v0.4)
   ref_norma / resultado_checklist — SOLO si NORMADO (E1, E5),
   nivel_riesgo (1–5)  ← SIEMPRE,
   **riesgo_severidad, riesgo_probabilidad, riesgo_justificación (S2)**,
   responsable_id, plazo_atención (calculado), estado (ABIERTO|EN_PROCESO|CERRADO),
   fecha_registro, fecha_cierre

Foto               id, hallazgo_id, tipo (HALLAZGO|ANTES|DESPUES|MONITOREO),
                   url, geolocalización, timestamp  **→ inmutable, cadena de custodia (S6)**
**Medición (E4)**  id, hallazgo_id, tipo (fisura_mm|desplome|deflexión|corrosión…), valor, fecha
Cierre             id, hallazgo_id, fecha, foto_antes_id, foto_después_id,
                   verificación_en_sitio (obligatorio 4–5),
                   **profesional_id, colegiatura_registro, sello_tiempo (E8)**
**Escalamiento (S4)** id, hallazgo_id, motivo, dirigido_a, fecha_envío, respuesta
Usuario            id (UUID), nombre, rol, colegiatura/registro, es_profesional_competente
```

> **(U2)** IDs UUID en cliente + timestamps = modelo listo para el offline de la Fase 2 sin reescribir.

---

## 9. Reglas de negocio (la columna legal — no se pueden saltar)

| Regla | Comportamiento |
|---|---|
| *Nivel 5* = inminente a la vida | Mitigación ≤ *72 h* · reparación ≤ 3 meses. Alerta crítica + notificación. **Abre protocolo de emergencia con contactos (S3).** |
| *Nivel 4* = crítico | Reparación ≤ *3 meses* + notificación inmediata. |
| *Niveles 2–3* | 3 meses – 1 año + monitoreo trimestral con foto **y medición (E4)** comparativa. |
| *Nivel 1* | Según programación; mantenimiento interno; monitoreo trimestral. |
| *Todo hallazgo* | ≥ 1 foto + nivel de riesgo asignado. No se guarda incompleto. **La norma NO es obligatoria; el riesgo sí.** |
| *Cierre* | Foto *antes + después* + visto bueno. Niveles 4–5: además verificación *en sitio*. Sin esto no pasa a `Cerrado`. |
| **Riesgo aceptado (S4)** | **Escalamiento formal a gerencia registrado como evidencia trazable, no como correo suelto.** |
| *Plazos* | `fecha_plazo` calculada automáticamente desde el nivel y la fecha de registro. |

---

## 10. UX, arquitectura y seguridad (lo esencial)

- **(U1) PWA única** (web + móvil en un solo código) → **(U2)** modelo sync-ready para offline en Fase 2.
- **(U3)** El color de riesgo nunca va solo: **color + número + ícono** (accesibilidad, sol de campo).
- **(U9)** Fotos: compresión en cliente + subida directa a la nube (URLs firmadas); original conservado como evidencia.
- **(S6)** Log inmutable de cambios, cierres y fotos — defendible ante instancias legales/aseguradoras/autoridades.
- **(S1) Seguridad del inspector (eje SSO):** checklist ATS, EPP, permisos de altura/espacio confinado, peligros eléctricos. Marco: normativa SSO aplicable en la jurisdicción.
- Acciones sensibles (cierre, visto bueno) restringidas por rol. Idioma español (configurable por región).

---

## 11. Decisiones pendientes

1. Nombre definitivo y branding.
2. ¿Multi-proyecto (multi-tenant) desde el inicio o un proyecto?
3. Subcategorías no estructurales: ¿catálogo o texto libre en el MVP?
4. Firmas: ¿firma digital formal o registro + visto bueno + colegiatura?
5. Notificaciones: ¿correo, push, o ambas?
6. Stack tecnológico y hosting.
7. **(S2)** Calibración de la matriz severidad × probabilidad.
8. **(E7)** Umbral de "sismo significativo" para reinspección extraordinaria.

> **Resuelto en v0.4:** el alcance del dominio → **norma abierta**. No se cierra a una norma; valida donde aplica y admite riesgo no normado.

---

## 12. Próximo paso propuesto

**Prototipo visual navegable** de las pantallas del núcleo (§1): registro de hallazgo con origen normado/no normado, asistente de riesgo, matriz + dashboard de vencidos, y cierre con evidencia. Validar la columna vertebral antes de escribir código de producción.

---

## 13. Trazabilidad de cambios

**v0.3 → v0.4 (Pareto 80/20 + norma abierta):**
- Se antepone el **principio rector**: núcleo = detectar → clasificar riesgo → cerrar con evidencia.
- **Norma abierta:** el hallazgo puede ser *normado* o *no normado (riesgo emergente)*; la norma es atributo opcional, no requisito.
- MVP recortado estrictamente al núcleo; todo lo demás pasa a capas posteriores o referencia opcional.
- Documento condensado (*menos es más*).

**v0.2 → v0.3 (base cero):** eliminadas todas las referencias a organizaciones, procedimientos y nombres propios de terceros; producto reencuadrado como independiente.

**Adiciones de la revisión de tres perfiles (v0.2):**

| | |
|---|---|
| **E1** Separar resultado de checklist vs. nivel de riesgo | **S1** Seguridad del inspector (ATS/EPP) |
| **E2** Terminología sin colisiones | **S2** Matriz severidad × probabilidad |
| **E3** Taxonomía de elementos estructurales | **S3** Protocolo de emergencia nivel 5 |
| **E4** Mediciones estructuradas | **S4** Escalamiento de riesgo aceptado |
| **E5** Trazabilidad a norma/patrón (si aplica) | **S5** Dashboard de vencidos críticos |
| **E6** Bandera "análisis de mayor nivel" | **S6** Cadena de custodia inmutable |
| **E7** Umbral de sismo significativo | **U1** PWA única · **U2** sync-ready |
| **E8** Colegiatura + sello de tiempo | **U3** Color accesible · **U4** tarjetas/tabla |
| | **U5** Voz + autoguardado · **U6** asistente de riesgo |
| | **U7** PDF firmado · **U8** MVP mínimo · **U9** fotos a la nube |

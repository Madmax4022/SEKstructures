# Dictamen técnico — Criterio de captura de hallazgos en Tier 1

> **Rol:** opinión emitida como profesional competente (ingeniería estructural), considerando que el usuario de campo es un **inspector SYSO**, no un estructurista.
> **Pregunta que responde:** ¿cuál es el nivel justo de lenguaje y detalle para señalar hallazgos en la etapa Tier 1, sin volver el reporte vulnerable ni por complejidad ni por falta de ella, y levantando la bandera a tiempo?
> **Efecto:** resuelve las decisiones pendientes #1 (subcategorías) y #2 (calibración de la matriz).
> **Fecha:** 2026-07-16

---

## 1. Principio rector: Tier 1 es cribado, no diagnóstico

El Tier 1 existe para **detectar y señalar**, no para explicar. El diagnóstico es del ingeniero estructurista que da seguimiento. De ahí sale la regla de oro de toda la captura:

> **"Describe lo que ves, no lo que crees que significa."**

Esto protege el reporte por los dos flancos que te preocupan:

| Vulnerabilidad | Cómo la evita este criterio |
|---|---|
| **Por complejidad:** pedirle al inspector SYSO que nombre mecanismos de falla ("cortante", "punzonamiento", "flexión") garantiza errores — y **un diagnóstico errado en un informe firmado es atacable** legal y técnicamente. | El inspector **nunca nombra mecanismos**. Solo síntomas observables + foto. Un síntoma bien descrito con foto es inatacable: nadie puede discutir que "hay una fisura de ~2 mm en esta columna, aquí está la foto". |
| **Por falta de complejidad:** "hay una grieta" sin tamaño, ubicación ni foto no permite triage — la bandera se levanta pero nadie sabe qué tan alto. | Mínimos obligatorios (síntoma + ubicación + foto + tamaño guiado) + **preguntas verticales automáticas** cuando la severidad sube. |

---

## 2. El justo medio: lenguaje de dos capas con escalamiento vertical

Exactamente lo que intuiste: la profundidad técnica **crece con la severidad**, y crece sola — el inspector no decide cuándo ser más técnico, la app se lo pide.

### Capa 1 — Lenguaje SYSO (siempre, todos los niveles)

**Catálogo corto de síntomas observables** (reemplaza a las subcategorías de la norma en campo). Cada uno con pictograma y foto de ejemplo:

1. Fisura / grieta
2. Deformación / pandeo / flecha visible
3. Corrosión / óxido
4. Desprendimiento / descascaramiento
5. Acero de refuerzo expuesto
6. Humedad / filtración / mancha
7. Asentamiento / desnivel
8. Elemento suelto o mal anclado
9. Impacto / daño mecánico
10. Elemento faltante o removido
11. Modificación no autorizada (perforación, corte, sobrecarga)
12. Otro (texto libre + foto obligatoria)

**Medidas guiadas sin vocabulario técnico** — comparadores cotidianos en vez de pedir precisión de laboratorio:

| Pregunta en la app | Traducción técnica que recibe el estructurista |
|---|---|
| ¿Entra una tarjeta en la fisura? | ancho ≈ 1 mm |
| ¿Entra una moneda? | ancho ≈ 2–3 mm |
| ¿Entra un dedo? | ancho ≥ 10 mm |
| ¿Se ve por ambos lados del elemento? | fisura pasante |

Todo se responde con tiles/casillas, no con texto. El inspector con guantes y sol encima toca, no redacta.

### Capa 2 — Escalamiento vertical (se activa sola en severidad alta)

Cuando el asistente calcula **nivel 4**, la app agrega 5 preguntas estructuradas — **aún observables**, pero que son exactamente lo que el estructurista necesita para hacer triage remoto y decidir si va hoy o la próxima semana:

1. ¿El elemento **soporta algo**? (techo, equipo pesado, piso superior)
2. ¿El daño **atraviesa** el elemento / se ve por ambos lados?
3. ¿Se nota **deformación a simple vista**?
4. ¿Alguien reporta que **apareció o creció recientemente**?
5. ¿Hay **más elementos iguales afectados**? (patrón)

Además se activa sola la bandera **"requiere evaluación de ingeniero estructural"** (campo E6, ya existe en el modelo).

### Excepción nivel 5 — captura mínima, no máxima

Contraintuitivo pero crucial: en riesgo inminente a la vida, la app pide **menos**, no más. Foto + ubicación + síntoma → acordonar / mitigar / notificar. El registro se completa después.

> **La app nunca debe poner un formulario entre el inspector y la mitigación de una fuga de gas.**

---

## 3. Sesgo conservador codificado

En cribado, el costo de equivocarse es asimétrico:

- **Falso positivo** (clasificar de más): barato — el estructurista revisa, baja el nivel y su ajuste queda trazado con justificación (`riesgo_justificación`, ya existe).
- **Falso negativo** (clasificar de menos): es exactamente **el evento negativo que quieres evitar**.

Por tanto, regla visible en el asistente de riesgo:

> **"¿Dudas entre dos niveles? Marca el mayor. El ingeniero lo ajustará en su revisión."**

Así "la bandera se levanta a tiempo" deja de depender del temple del inspector: el sistema le da permiso explícito de ser conservador.

---

## 4. Resolución de las decisiones pendientes

| # | Decisión | Resolución |
|---|---|---|
| 1 | **Subcategorías**: ¿catálogo de la norma o texto libre? | **Ninguna de las dos.** En campo: **catálogo de síntomas observables** (§2, Capa 1). El mapeo a subcategorías normativas lo hace el ingeniero **en gabinete**, solo para hallazgos normados (`ref_norma` ya existe). El catálogo completo de la norma es demasiado para SYSO; el texto libre puro es inconsistente y vulnerable por omisión. |
| 2 | **Calibración de la matriz** severidad × probabilidad | **Calibrada en lenguaje SYSO** (§5, abajo). Los niveles no cambian; cambia cómo se pregunta. |
| 3 | Umbral de "sismo significativo" | **Sigue pendiente** — es una decisión de política del propietario/cliente, no de criterio de captura. |

---

## 5. Matriz calibrada en lenguaje SYSO

**Severidad — la app pregunta: "¿Qué pasaría si esto falla ahora?"**

| Opción (lenguaje llano) | Nivel interno |
|---|---|
| Puede caer sobre personas, bloquear una salida de evacuación, o involucra gas / sistema contra incendios | Inminente |
| Afecta un elemento que carga peso o un sistema de seguridad | Crítica |
| Daño funcional (se puede usar, pero mal) sin riesgo directo a personas | Moderada |
| Superficial o estético | Menor |

**Probabilidad — la app pregunta: "¿Hay señales de que está avanzando?"** — con indicios observables, no juicio abstracto:

| Indicio observable | Lectura |
|---|---|
| Fisura con bordes limpios, sin pintura ni polvo adentro | Reciente / activa → probabilidad alta |
| Fisura con pintura o suciedad dentro | Antigua y estable → probabilidad baja |
| Óxido que laminó o descascara al tocarlo | Corrosión activa → alta |
| Óxido superficial parejo | Estable → baja–media |
| Mancha húmeda al tacto | Filtración activa → alta |
| Mancha seca | Evento pasado → baja |

La **regla dura** no cambia: gas / contra incendios / colapso → nivel 5 automático.

---

## 6. Qué cambia en el producto si se adopta este dictamen

1. El selector de "subcategoría" del hallazgo se convierte en el **catálogo de síntomas** con pictogramas (Capa 1).
2. El asistente de riesgo usa las **preguntas calibradas** de §5.
3. Se agregan las **5 preguntas verticales** que aparecen solo en nivel 4.
4. Se agrega la **vía rápida de nivel 5** (captura mínima + acción inmediata).
5. Se muestra el mensaje del **sesgo conservador** en el asistente.
6. Las **medidas guiadas** (tarjeta/moneda/dedo) reemplazan el campo libre de medición para fisuras.

*(Ninguno de estos cambios toca la frontera del producto ni el modelo de datos de fondo: son refinamientos de captura sobre lo ya diseñado.)*

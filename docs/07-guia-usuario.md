# Guía rápida — SEK Estructuras

> App de inspección estructural para el inspector de campo.
> **Dirección:** `https://madmax4022.github.io/SEKstructures/`
> Ábrela en el navegador del teléfono. Puedes agregarla a la pantalla de inicio (menú del navegador → «Agregar a pantalla de inicio») para usarla como una app normal.

---

## Idea en una línea

**La app inspecciona, clasifica el riesgo y entrega el informe. Ahí se detiene.**
Lo que pase después con la reparación —cotizar, arreglar, verificar— es trabajo de otros. Por eso el informe se entrega con una matriz de seguimiento anexa, para que el encargado continúe por su cuenta.

---

## 1. Preparar el edificio *(una sola vez por proyecto)*

1. Toca **+ Nuevo proyecto**.
2. Escribe el **nombre** y la **ubicación** del edificio.
3. Elige el **tipo** (centro comercial, oficinas, industrial, mixto).
4. La app te sugiere las **secciones típicas** de ese tipo — incluidas las que suelen olvidarse: pasillos de servicio, mezanines, cubiertas, cuartos de máquinas.
   - Toca una sección para **activarla o desactivarla**.
   - Agrega las propias abajo (ej. «Muro anclado costado norte»).
5. Crea el proyecto.

> **Las secciones son tus unidades de inspección.** Cada informe se arma por sección, y las que no inspecciones quedan visibles como alcance pendiente.

---

## 2. Antes de entrar — tu seguridad

Toca una sección y aparece el **checklist de seguridad**. No puedes empezar el recorrido sin marcar las cuatro:

- Análisis de Trabajo Seguro (ATS)
- Equipo de protección personal (EPP)
- Permisos de altura / espacio confinado
- Peligros eléctricos identificados

> La app cuida el hallazgo, pero **primero te cuida a ti**.

---

## 3. Registrar un hallazgo

### La regla de oro

> **Describe lo que VES, no lo que crees que significa.**

Tú detectas y señalas; el ingeniero estructural diagnostica después. Nunca necesitas nombrar mecanismos de falla ni saber qué norma aplica.

### Paso 1 — Qué encontraste

| Campo | Qué poner |
|---|---|
| **¿Cómo lo detectaste?** | *Aplicando la lista de verificación* o *Observación directa*. Nada más — si aplica una norma, el ingeniero la ancla en gabinete |
| **Tipo de elemento** | Estructural (columna, viga, muro…) o No estructural (luminarias, tuberías…) |
| **Elemento / categoría** | Toca el **ícono ℹ** para ver el catálogo con definiciones y ejemplos. Puedes elegir directo desde ahí |
| **Síntomas** | Marca **todos** los que veas. La app decide sola cuál es el principal — no importa el orden en que los toques |
| **Medida guiada** | Solo si marcaste fisura: ¿entra una **tarjeta** (~1 mm), una **moneda** (2–3 mm) o un **dedo** (≥10 mm)? |
| **Ubicación** | Lo más preciso posible: «Eje C-4, nivel sótano» |
| **Descripción** | Qué observaste, en tus palabras |
| **Fotografía** | **Obligatoria.** Sin foto no se guarda el hallazgo |

> **¿Ves dos problemas distintos en el mismo punto?** Regístralos como **dos hallazgos** separados.

### Paso 2 — Clasificar el riesgo

No pones el nivel a mano: **la app lo calcula** con dos preguntas.

**1. ¿Qué pasaría si esto falla ahora?**

| Opción | Cuándo |
|---|---|
| **Inminente** | Puede caer sobre personas, bloquear una salida, o involucra gas / contra incendios |
| **Crítica** | Afecta un elemento que carga peso o un sistema de seguridad |
| **Moderada** | Daño funcional, sin riesgo directo a personas |
| **Menor** | Superficial o estético |

**2. ¿Hay señales de que está avanzando?** — guíate por lo que ves:

| Lo que observas | Significa |
|---|---|
| Fisura con bordes limpios, sin pintura adentro | Reciente / activa → **Alta** |
| Fisura con pintura o suciedad adentro | Antigua y estable → **Baja** |
| Óxido que se descascara al tocarlo | Corrosión activa → **Alta** |
| Mancha húmeda al tacto | Filtración activa → **Alta** |
| Mancha seca | Evento pasado → **Baja** |

**Regla dura:** si involucra **gas, sistema contra incendios o riesgo de colapso**, marca esa casilla → el resultado es **nivel 5** automáticamente.

> **¿Dudas entre dos niveles? Marca el mayor.** El ingeniero lo ajustará en su revisión. Equivocarse por exceso es barato; por defecto, no.

### Qué pasa según el nivel

| Nivel | La app hace |
|---|---|
| **5** | Vía rápida: te dice **mitiga primero** (acordonar, restringir acceso, cerrar válvulas) y notificar. El registro se completa después |
| **4** | Pide 5 datos extra para el ingeniero (¿soporta carga?, ¿atraviesa?, ¿deformación?, ¿creció?, ¿patrón?) |
| **1–3** | Guarda con su plazo sugerido |

---

## 4. Lo que no pudiste ver

Botón **«Elementos no evaluados»**. Registra lo que quedó fuera de tu alcance: qué era, por qué (acceso, cielo falso, iluminación…) y con qué medio lo intentaste (dron, binoculares, pértiga).

> Esto tiene **el mismo peso legal que un hallazgo**: delimita de qué responde tu informe. Nadie puede asumir que revisaste lo que no se podía ver.

---

## 5. Entregar los resultados

Botón **«Generar entregable →»**:

1. Revisa el **resumen por nivel** y el contenido del informe.
2. Escribe tu **colegiatura / registro profesional** y a quién se entrega.
3. **🖨 Informe — imprimir / guardar PDF**: genera el documento formal (resumen, matriz con colores, elementos no evaluados, declaración de alcance y **dos cuadros de firma**). Desde el diálogo puedes guardarlo como PDF, imprimirlo o enviarlo por correo.
4. **⇩ Matriz de seguimiento**: descarga el Excel pre-llenado con las columnas de estado, cierre y evidencia **vacías**, para que el receptor continúe el seguimiento por su cuenta.
5. **Emitir informe firmado**: queda registrado con sello de tiempo, **inmutable**. No se puede modificar después — esa es su garantía legal.

---

## Preguntas frecuentes

**¿Puedo trabajar sin señal?**
Todavía no. Es la próxima prioridad del desarrollo. Por ahora necesitas datos o wifi.

**¿Puedo corregir un hallazgo ya guardado?**
Aún no. Revisa antes de guardar. Está en la lista de mejoras inmediatas.

**¿Otra persona puede ver mis proyectos?**
No. Cada cuenta ve solo sus propios proyectos.

**¿La app me dice qué reparar y cómo?**
No, y es deliberado. La app señala y clasifica; el diagnóstico y la solución los define un ingeniero estructural.

**¿Qué hago si no sé en qué categoría va un hallazgo?**
Toca el **ícono ℹ** para ver el catálogo con ejemplos. Si aun así dudas, elige lo más cercano (o «Otro» en síntomas) y **describe bien lo que ves** — la descripción y la foto son lo que importa.

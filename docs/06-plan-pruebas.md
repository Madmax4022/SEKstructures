# Plan de pruebas — SEK Estructuras

> **Para qué sirve:** verificar que la app funciona completa antes de usarla en una inspección real o mostrarla a un cliente.
> **Cuánto toma:** 20–25 minutos.
> **Qué necesitas:** un teléfono con internet y la app abierta en `https://madmax4022.github.io/SEKstructures/`.

---

## Antes de empezar

1. Abre la app y verifica el **número de build** bajo el nombre en la pantalla de entrada.
2. Si acabas de recibir una actualización y el número no cambió, abre en **pestaña privada / incógnito** (el navegador guarda la versión anterior unos minutos).

Marca cada prueba: ✅ pasa · ❌ falla (anota qué viste) · ⚠️ pasa con observación.

---

## Bloque 1 — Entrada y proyecto (5 min)

| # | Qué hacer | Qué debe pasar | ✅/❌ |
|---|---|---|---|
| 1.1 | Crear cuenta con correo y contraseña | Entra directo a la lista de proyectos | |
| 1.2 | Cerrar sesión (ícono ⎋) y volver a entrar | Recuerda tus proyectos | |
| 1.3 | Tocar «+ Nuevo proyecto», poner nombre y ubicación | Avanza al paso 2 | |
| 1.4 | Elegir tipo «Centro comercial» | Sugiere secciones típicas del tipo elegido | |
| 1.5 | Cambiar a «Oficinas» y volver a «Centro comercial» | Las sugerencias cambian con el tipo | |
| 1.6 | Desactivar 2 secciones y agregar una propia | El botón dice el número correcto de secciones | |
| 1.7 | Crear el proyecto | Muestra las secciones exactas que elegiste | |

## Bloque 2 — Seguridad e inicio de inspección (3 min)

| # | Qué hacer | Qué debe pasar | ✅/❌ |
|---|---|---|---|
| 2.1 | Tocar una sección | Abre el checklist de seguridad (ATS/EPP) | |
| 2.2 | Intentar «Comenzar recorrido» sin marcar todo | El botón está bloqueado | |
| 2.3 | Marcar las 4 casillas | El botón se activa | |
| 2.4 | Comenzar recorrido | Abre la pantalla de hallazgos vacía | |

## Bloque 3 — Registrar un hallazgo (7 min)

| # | Qué hacer | Qué debe pasar | ✅/❌ |
|---|---|---|---|
| 3.1 | «+ Nuevo hallazgo» → elegir «Observación directa» | Aparece la nota de que el ingeniero ancla la norma | |
| 3.2 | Cambiar entre Estructural / No estructural | La lista de categorías cambia | |
| 3.3 | **Tocar el ícono ℹ junto al selector** | Abre el catálogo con definiciones y ejemplos | |
| 3.4 | Elegir una categoría tocándola en el catálogo | Se cierra y queda seleccionada | |
| 3.5 | Marcar «Corrosión» y luego «Fisura» *(en ese orden)* | El principal debe ser **Fisura** (la app ordena por prioridad, no por orden de toque) | |
| 3.6 | Con «Fisura» marcada | Aparece la medida guiada (tarjeta / moneda / dedo) | |
| 3.7 | Intentar continuar sin foto | Bloqueado, indica que falta la fotografía | |
| 3.8 | Tomar la foto y continuar | Pasa a «Clasificar riesgo» | |

## Bloque 4 — Asistente de riesgo (5 min)

| # | Qué hacer | Qué debe pasar | ✅/❌ |
|---|---|---|---|
| 4.1 | Severidad «Crítica» + Probabilidad «Media» | Calcula **nivel 4** | |
| 4.2 | Con nivel 4 | Aparecen las 5 preguntas «Detalle para el ingeniero» | |
| 4.3 | Marcar la casilla de gas / incendio / colapso | Salta a **nivel 5** y muestra la vía rápida «mitiga primero» | |
| 4.4 | Desmarcarla | Vuelve al nivel calculado | |
| 4.5 | Severidad «Menor» + Probabilidad «Baja» | Calcula **nivel 1** | |
| 4.6 | Guardar el hallazgo | Aviso de confirmación y aparece en la matriz | |
| 4.7 | Registrar un segundo hallazgo de otro nivel | Se ordena por severidad (el más grave arriba) | |

## Bloque 5 — Alcance y entregable (5 min)

| # | Qué hacer | Qué debe pasar | ✅/❌ |
|---|---|---|---|
| 5.1 | «Elementos no evaluados» → registrar uno | Aparece en la lista con motivo y medio | |
| 5.2 | «Generar entregable →» | Muestra resumen por nivel y conteos correctos | |
| 5.3 | Verificar «Evidencia fotográfica» | Coincide con las fotos que tomaste | |
| 5.4 | **«Informe — imprimir / guardar PDF»** | Abre el diálogo de impresión con el informe formado | |
| 5.5 | En el PDF: revisar el final | Aparecen **dos cuadros de firma** (profesional y recibido por) | |
| 5.6 | **«Matriz de seguimiento»** | Descarga y abre en Excel: columnas separadas y **acentos correctos** | |
| 5.7 | Escribir la colegiatura y emitir | Confirma emisión con sello de tiempo | |
| 5.8 | Intentar emitir de nuevo | El botón queda deshabilitado (un informe emitido es inmutable) | |

## Bloque 6 — Seguridad de datos (2 min)

| # | Qué hacer | Qué debe pasar | ✅/❌ |
|---|---|---|---|
| 6.1 | Crear una segunda cuenta con otro correo | Entra con lista de proyectos **vacía** | |
| 6.2 | Desde esa cuenta, buscar el proyecto de la primera | **No debe verlo** (aislamiento por usuario) | |

---

## Si algo falla

Anota: **qué pantalla**, **qué tocaste**, **qué decía el mensaje** y el **número de build**. Una captura de pantalla vale más que la descripción — los mensajes de error indican el paso exacto donde ocurrió el problema.

# SEK Estructuras

Herramienta independiente para **ejecutar inspecciones y entregar resultados**. Producto propiedad de su creador.

**Filosofía:** 80/20, *menos es más*, **norma abierta** y **la app entrega y se detiene**. El núcleo es: detectar un hallazgo → clasificar su riesgo (1–5) → entregar los resultados (matriz + evidencia + informe firmado) en manos del encargado. La norma valida donde aplica, pero un hallazgo **no necesita una norma para existir**: también entran los riesgos emergentes no normados. Todo el seguimiento posterior a la entrega (reparación, cotizaciones, cierre) es **externo a la app**.

## Estado

En fase de definición del concepto. El código aún no comienza.

## Documentación

- [`docs/01-concepto-app.md`](docs/01-concepto-app.md) — Concepto y especificación del producto (**v0.6**): principio rector 80/20, **frontera de alcance** (dentro / fuera), norma abierta, alcance del MVP, flujo, modelo de datos y reglas de negocio. Las adiciones de la revisión de tres perfiles van en negrita, con trazabilidad al final.
- [`docs/02-plan-tecnico.md`](docs/02-plan-tecnico.md) — Plan técnico y hoja de ruta (**v1**): stack recomendado (PWA + Supabase), piezas, etapas de construcción del MVP, costo/riesgo y decisiones pendientes.
- [`docs/03-compliance-origen.md`](docs/03-compliance-origen.md) — Auditoría de compliance contra los documentos originales: matriz de 41 requisitos (cumple / mejora / parcial / referencia / excluido por decisión / pendiente), balance y propuestas para cerrar la brecha de seguimiento sin romper la frontera del producto.
- [`prototype/index.html`](prototype/index.html) — Prototipo navegable del núcleo (v0.5).

## El ciclo que digitaliza la app

```
Planificación → Inspección en campo → Análisis → Cierre → Seguimiento
```

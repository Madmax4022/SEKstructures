# SEK Estructuras

Herramienta independiente para **ejecutar inspecciones y entregar resultados**. Producto propiedad de su creador.

**Filosofía:** 80/20, *menos es más*, **norma abierta** y **la app entrega y se detiene**. El núcleo es: detectar un hallazgo → clasificar su riesgo (1–5) → entregar los resultados (matriz + evidencia + informe firmado) en manos del encargado. La norma valida donde aplica, pero un hallazgo **no necesita una norma para existir**: también entran los riesgos emergentes no normados. Todo el seguimiento posterior a la entrega (reparación, cotizaciones, cierre) es **externo a la app**.

## Estado

**Etapa 0 en marcha** — el código comenzó: esquema de base de datos (Supabase) y esqueleto de la PWA (React + TypeScript + Vite). Ver `app/README.md` para la puesta en marcha.

## Documentación

- [`docs/01-concepto-app.md`](docs/01-concepto-app.md) — Concepto y especificación del producto (**v0.6**): principio rector 80/20, **frontera de alcance** (dentro / fuera), norma abierta, alcance del MVP, flujo, modelo de datos y reglas de negocio. Las adiciones de la revisión de tres perfiles van en negrita, con trazabilidad al final.
- [`docs/02-plan-tecnico.md`](docs/02-plan-tecnico.md) — Plan técnico y hoja de ruta (**v1**): stack recomendado (PWA + Supabase), piezas, etapas de construcción del MVP, costo/riesgo y decisiones pendientes.
- [`docs/03-compliance-origen.md`](docs/03-compliance-origen.md) — Auditoría de compliance contra los documentos originales: matriz de 41 requisitos (cumple / mejora / parcial / referencia / excluido por decisión / pendiente), balance y propuestas para cerrar la brecha de seguimiento sin romper la frontera del producto.
- [`docs/04-criterio-captura-tier1.md`](docs/04-criterio-captura-tier1.md) — Dictamen técnico del profesional competente: criterio de captura en Tier 1 (cribado, no diagnóstico), lenguaje de dos capas con escalamiento vertical por severidad, catálogo de síntomas observables, matriz calibrada en lenguaje SYSO y sesgo conservador. Resuelve las decisiones pendientes de subcategorías y calibración.
- [`docs/05-roadmap.md`](docs/05-roadmap.md) — Roadmap: estado actual y fases A (endurecer), B (offline), C (equipo), D (comercial), con lo que deliberadamente queda fuera.
- [`docs/06-plan-pruebas.md`](docs/06-plan-pruebas.md) — Plan de pruebas de 20 min: 6 bloques con casos verificables antes de una inspección real.
- [`docs/07-guia-usuario.md`](docs/07-guia-usuario.md) — Guía rápida para el inspector de campo.
- [`prototype/index.html`](prototype/index.html) — Prototipo navegable del núcleo (v0.6).
- [`app/`](app/) — La aplicación real (PWA React + TypeScript + Vite). Etapa 0: conexión y tipos.
- [`supabase/migrations/`](supabase/migrations/) — Esquema de base de datos: tablas, RLS multi-proyecto, auditoría e inmutabilidad de evidencia.

## El ciclo que digitaliza la app

```
Planificar → Inspeccionar (hallazgos + riesgo 1–5 + no evaluados) → Entregar resultados
             (la app entrega y se detiene; el informe anexa la matriz de
              seguimiento y la declaración de alcance para el receptor)
```

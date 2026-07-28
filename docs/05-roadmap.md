# Roadmap — SEK Estructuras

> **Estado a hoy:** MVP funcional en producción (`https://madmax4022.github.io/SEKstructures/`), validado en campo por el creador con datos reales.
> **Fecha:** 2026-07-21

---

## Dónde estamos

| Etapa | Estado |
|---|---|
| Concepto y criterio técnico | ✅ v0.6 + dictamen del profesional competente |
| Prototipo navegable | ✅ Validado |
| Etapa 0 — Cimientos (BD + auth + RLS) | ✅ En producción |
| Etapa 1a — Proyectos y secciones | ✅ Probado con datos reales |
| Etapa 1b — Inspección, hallazgos, riesgo | ✅ Probado con datos reales |
| Etapa 1c — Fotos, no evaluados, entregable | ✅ Probado con datos reales |
| Despliegue automático (CI/CD) | ✅ Cada push redespliega |

**El ciclo completo funciona:** inspeccionar → clasificar → entregar (PDF + matriz Excel) → la app se detiene.

---

## Fase A — Endurecer para uso real *(próximas semanas)*

Objetivo: que otra persona además de ti pueda usarlo en una inspección real sin acompañamiento.

| # | Entregable | Por qué |
|---|---|---|
| A1 | **Fotos en el informe PDF** | Hoy se cuentan pero no se ven; la evidencia visual es el corazón del entregable |
| A2 | **Compresión de fotos en el teléfono** | Una foto de 4 MB × 30 hallazgos agota datos y almacenamiento |
| A3 | **Ver / borrar hallazgo registrado** | Hoy no se puede corregir un error de captura |
| A4 | **Varias fotos por hallazgo** | Un hallazgo suele necesitar contexto + detalle |
| A5 | **Reanudar inspección en curso** | Si cierras la app, hoy pierdes el hilo de la inspección |
| A6 | **Editar secciones del proyecto** | Renombrar o eliminar secciones creadas por error |

## Fase B — Trabajo sin señal *(el desbloqueador de campo)*

| # | Entregable | Por qué |
|---|---|---|
| B1 | **Modo offline con sincronización** | Sótanos, cuartos de máquinas y cubiertas no tienen señal — es el bloqueador #1 de uso real |
| B2 | **Instalación como app (PWA)** | Ícono en la pantalla de inicio, sin barra del navegador |
| B3 | **Dictado por voz en la descripción** | Manos con guantes, sol encima |
| B4 | **Geolocalización de la foto** | Refuerza la trazabilidad de la evidencia |

## Fase C — Equipo y multiempresa *(el paso a producto vendible)*

| # | Entregable | Por qué |
|---|---|---|
| C1 | **Invitar miembros al proyecto** | Hoy el esquema lo soporta, la interfaz no |
| C2 | **Roles diferenciados en la interfaz** | Inspector vs. administración vs. dirección técnica |
| C3 | **Panel web (tablet/escritorio)** | La matriz en tabla ancha para gabinete |
| C4 | **Historial de inspecciones por sección** | Comparar contra la inspección anterior |
| C5 | **Plantillas de informe con logo del cliente** | Un informe con marca propia se vende solo |

## Fase D — Comercial *(solo con validación de mercado previa)*

| # | Entregable | Condición |
|---|---|---|
| D1 | Constitución legal, términos y política de privacidad | **Bloqueante** para vender a una empresa |
| D2 | Planes y facturación | Después de validar precio con 3-5 clientes |
| D3 | Módulo «Seguimiento» activable (compliance C) | Upsell ya diseñado en el esquema |
| D4 | Dominio propio y marca definitiva | Cuando haya nombre comercial decidido |

---

## Lo que NO está en el roadmap (y por qué)

Coherencia con la frontera del producto (concepto v0.5):

- ❌ Gestión de la reparación (cotizaciones, órdenes de compra, pagos)
- ❌ Seguimiento del contratista
- ❌ Cierre de hallazgos dentro de la app *(salvo como módulo opcional D3)*

**La app entrega y se detiene.** Eso no cambia.

---

## Recomendación de secuencia

1. **A1–A3 primero** (fotos en el PDF, compresión, corregir hallazgo) — es lo que más duele hoy en uso real.
2. **B1 (offline) enseguida** — sin eso, la app falla justo donde más se necesita.
3. **Antes de la Fase C:** 3-5 conversaciones con inspectores o administradores reales. Si no pagan, C y D no valen el esfuerzo.

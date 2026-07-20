# Plan técnico y hoja de ruta — cómo construir el MVP

> **Producto:** SEK Estructuras — herramienta de inspección y entrega de resultados.
> **Base:** Concepto v0.5 (`docs/01-concepto-app.md`) + prototipo navegable.
> **Estado:** Propuesta técnica v1 — para decidir el rumbo de construcción.
> **Fecha:** 2026-07-16

---

## 1. Objetivo de este documento

Traducir el concepto a una decisión de construcción: **con qué tecnología, en qué orden y con qué costo** se levanta el MVP (el núcleo: inspeccionar → clasificar riesgo → entregar). Sin humo: una recomendación principal y por qué.

---

## 2. Recomendación en una línea

> **Una PWA (React + TypeScript) sobre Supabase** (base de datos + login + almacenamiento de fotos, todo administrado).

Es la combinación con **menos piezas que mantener** y que cubre de fábrica casi todo lo que el concepto exige: roles, multi-proyecto, fotos con enlaces firmados, y un camino claro al offline.

---

## 3. Por qué esta combinación (mapeo al núcleo)

| Lo que exige el concepto | Cómo lo resuelve el stack |
|---|---|
| **PWA única** (web + móvil, un solo código) | React + Vite, instalable, usa la cámara del navegador. |
| **Roles y permisos** (cierre/visto bueno restringidos) | Supabase Auth + reglas de acceso por fila (RLS). |
| **Multi-proyecto** (varios edificios) | RLS por proyecto: cada quien ve lo suyo. |
| **Fotos como evidencia** | Supabase Storage + **enlaces firmados** y compresión en el celular. |
| **Cadena de custodia / auditoría** | Postgres con registro de cambios + sello de tiempo. |
| **Modelo listo para offline** (Fase 2) | IDs generados en el cliente (UUID) desde el día 1. |
| **Entregable firmado (PDF)** | Generación del PDF en el propio celular (sin servidor extra). |

---

## 4. Las piezas y qué hace cada una

| Pieza | Rol | Alternativa |
|---|---|---|
| **React + TypeScript + Vite** | La app (PWA instalable) | — |
| **Supabase** | Base de datos (Postgres), login, almacenamiento de fotos, reglas de acceso | Firebase (equivalente) |
| **Vercel / Netlify** | Donde vive la PWA (hosting) | Cualquier hosting estático |
| **pdf-lib (en el navegador)** | Arma el informe firmado | Función de servidor (más adelante) |
| *Dexie / IndexedDB* | *(Fase 2)* copia local para trabajar sin señal | PowerSync / ElectricSQL |

> **No recomiendo** empezar con un backend hecho a mano (Node + servidor + base propia): triplica el trabajo de mantenimiento para un beneficio que no necesitamos en el MVP.

---

## 5. Hoja de ruta de construcción

**Etapa 0 — Cimientos (base de datos + login).** ✅ **En marcha (2026-07-16):** esquema completo en `supabase/migrations/0001_esquema_inicial.sql` (tablas, enums, RLS multi-proyecto, auditoría, inmutabilidad de fotos e informes emitidos) y esqueleto de la PWA en `app/` (Vite + React + TS, cliente Supabase, tipos espejo). Falta: crear el proyecto Supabase real y aplicar la migración (pasos en `app/README.md`).

**Etapa 1 — El núcleo capturable.** 🔨 **En marcha (2026-07-16):** login (Supabase Auth + perfil), **onboarding de proyecto con secciones sugeridas por tipo de edificio** (chips activables + secciones propias), lista de proyectos y detalle de secciones — todo guardando en Supabase. Falta (Etapa 1b): inspección → hallazgo con foto → asistente de riesgo → matriz.
Nota: el sandbox de desarrollo no puede alcanzar *.supabase.co (política de red); la verificación en vivo se hace corriendo la app localmente (`cd app && npm install && npm run dev`).

**Etapa 2 — El entregable.**
Elementos no evaluados + **informe PDF firmado** (colegiatura + sello de tiempo) + constancia de entrega. Con esto el MVP está **completo y usable en una inspección real**.

**Etapa 3 — Endurecer.**
Permisos finos por rol, registro de auditoría, exportación de la matriz (Excel), calibración de la matriz de riesgo con la dirección técnica.

**Fase 2 (después del MVP) — Campo sin señal.**
Modo offline con sincronización, dictado por voz, geolocalización de fotos.

**Opción comercial futura — Módulo "Seguimiento" activable (compliance C).**
El bloque excluido por la frontera del producto (estado abierto/en proceso/cerrado, monitoreo trimestral, cierre con evidencia, escalamiento) ya quedó diseñado en la v0.2 del concepto. Puede ofrecerse más adelante como módulo opcional para clientes que quieran el ciclo completo dentro de la app, sin tocar el núcleo. En la Etapa 2 del MVP entra en su lugar el **puente de compliance**: matriz de seguimiento exportable + declaración de alcance en el informe.

---

## 6. Costo y riesgo

- **Costo inicial: prácticamente cero.** Supabase y Vercel tienen plan gratuito que cubre de sobra un piloto y las primeras inspecciones reales. El costo aparece solo al crecer el volumen de fotos y usuarios, y escala de forma económica.
- **Riesgo técnico: bajo.** Son tecnologías maduras y muy usadas; nada experimental.
- **Dependencia:** el modelo de datos es Postgres estándar, así que si algún día conviene salir de Supabase, la información es portable (no quedamos amarrados).

---

## 7. Lo que necesito decidir contigo

1. **¿Arrancamos construcción con este stack** (PWA + Supabase) o quieres que compare a fondo alguna alternativa antes?
2. **Multi-proyecto desde el día 1**, ¿sí? (Lo recomiendo: casi no cuesta más y evita rehacer después.)
3. **Nombre y marca** definitivos (afecta el dominio y el look).
4. **Firma del informe:** ¿basta registro de usuario + colegiatura + sello de tiempo, o quieres firma digital formal (certificado)? Lo primero es suficiente para el MVP.

---

## 8. Próximo paso propuesto

Si te parece bien el rumbo, el primer entregable de construcción sería la **Etapa 0**: montar el modelo de datos y el login en Supabase, para tener los cimientos sobre los que se enchufa el prototipo que ya existe.

# SEK Estructuras — App (PWA)

PWA en React + TypeScript + Vite sobre Supabase. Estado: **Etapa 0** (cimientos).

## Puesta en marcha

1. **Crear el proyecto Supabase** (gratis): <https://supabase.com> → New project.
2. **Aplicar el esquema:** abre el *SQL Editor* del panel y ejecuta el contenido de
   [`../supabase/migrations/0001_esquema_inicial.sql`](../supabase/migrations/0001_esquema_inicial.sql).
3. **Crear el bucket de evidencia:** panel → Storage → New bucket → nombre `evidencia`, **privado**.
4. **Configurar la app:**
   ```bash
   cp .env.example .env.local
   # editar .env.local con la URL y la anon key (panel → Settings → API)
   ```
5. **Correr en desarrollo:**
   ```bash
   npm install
   npm run dev
   ```
   La pantalla de estado confirma la conexión ("Conectado a Supabase ✓").

## Estructura

| Ruta | Qué es |
|---|---|
| `src/lib/supabase.ts` | Cliente de Supabase (null hasta configurar el entorno) |
| `src/types/db.ts` | Tipos espejo del esquema SQL, anotados con su fuente conceptual |
| `../supabase/migrations/` | Esquema: tablas, enums, RLS por proyecto, auditoría e inmutabilidad |

## Qué garantiza ya el esquema (sin escribir código)

- **Multi-proyecto desde el día 1:** cada fila protegida por membresía (`proyecto_miembro` + RLS).
- **Fotos inmutables:** sin política de UPDATE/DELETE — cadena de custodia (S6).
- **Informe emitido inmutable:** trigger que bloquea cambios tras la emisión (E8).
- **Emisión restringida:** solo un perfil con `es_profesional_competente` puede pasar un informe a `EMITIDO`.
- **Auditoría automática:** todo INSERT/UPDATE/DELETE en hallazgos, informes y fotos queda en `auditoria`.

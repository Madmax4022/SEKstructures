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

## Publicar en GitHub Pages (link gratis desde el repo)

Ya hay un flujo de despliegue automático (`.github/workflows/deploy-pages.yml`). Configuración de una sola vez:

1. **Variables de entorno:** repo → *Settings → Secrets and variables → Actions → Variables* → *New repository variable*, dos veces:
   - `VITE_SUPABASE_URL` = `https://TU-PROYECTO.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = tu anon key *(es pública por diseño; RLS protege los datos)*
2. **Activar Pages:** repo → *Settings → Pages → Build and deployment → Source: **GitHub Actions***.
3. **Auth de Supabase:** panel de Supabase → *Authentication → URL Configuration* → agrega la URL de Pages
   (`https://<usuario>.github.io/SEKstructures/`) como *Site URL* y *Redirect URL*.

Con eso, cada push a la rama redepliega la app y el link queda en
`https://<usuario>.github.io/SEKstructures/`. También puedes dispararlo a mano en *Actions → Desplegar PWA a GitHub Pages → Run workflow*.

> **Nota:** la *anon key* viaja en el bundle público (así funcionan todas las apps cliente de Supabase); la seguridad real la dan las políticas RLS de la migración, no el ocultamiento de esa clave.

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

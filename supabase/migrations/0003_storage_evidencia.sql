-- ============================================================================
-- SEK Estructuras — 0003: acceso al bucket de evidencia fotográfica
-- Requiere que el bucket 'evidencia' (privado) ya exista (Storage → New bucket).
-- Permite a usuarios autenticados subir y leer evidencia. Sin UPDATE ni DELETE:
-- las fotos son inmutables (cadena de custodia, S6).
-- ============================================================================

drop policy if exists evidencia_insert on storage.objects;
drop policy if exists evidencia_select on storage.objects;

create policy evidencia_insert on storage.objects
  for insert to authenticated
  with check (bucket_id = 'evidencia');

create policy evidencia_select on storage.objects
  for select to authenticated
  using (bucket_id = 'evidencia');

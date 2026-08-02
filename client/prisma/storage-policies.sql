-- Run against your Supabase Postgres (via Prisma db execute or the SQL editor).
-- Allows authenticated users to upload and delete objects in the "resumes" bucket,
-- scoped to their own "<user-id>/" folder.

create policy "own folder insert"
  on storage.objects for insert to authenticated
  with check (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "own folder delete"
  on storage.objects for delete to authenticated
  using (bucket_id = 'resumes' and (storage.foldername(name))[1] = auth.uid()::text);

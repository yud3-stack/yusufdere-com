-- Admin writes for projects and the project-covers bucket.
-- Being signed in is not enough. public.is_admin() must be true.
-- Public read of published projects stays as defined in the initial migration.

grant insert, update, delete on table public.projects to authenticated;

create policy "Admin can read all projects"
  on public.projects
  for select
  to authenticated
  using (public.is_admin());

create policy "Admin can insert projects"
  on public.projects
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can update projects"
  on public.projects
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete projects"
  on public.projects
  for delete
  to authenticated
  using (public.is_admin());

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'project-covers',
  'project-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view project covers" on storage.objects;
drop policy if exists "Admin can upload project covers" on storage.objects;
drop policy if exists "Admin can update project covers" on storage.objects;
drop policy if exists "Admin can delete project covers" on storage.objects;

create policy "Public can view project covers"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'project-covers');

create policy "Admin can upload project covers"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'project-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'projects'
  );

create policy "Admin can update project covers"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'project-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'projects'
  )
  with check (
    bucket_id = 'project-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'projects'
  );

create policy "Admin can delete project covers"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'project-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'projects'
  );

-- Public images used inside blog posts. Viewing is public.
-- Upload, update, and delete require public.is_admin(), not merely an authenticated session.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'post-assets',
  'post-assets',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view post assets" on storage.objects;
drop policy if exists "Admin can upload post assets" on storage.objects;
drop policy if exists "Admin can update post assets" on storage.objects;
drop policy if exists "Admin can delete post assets" on storage.objects;

create policy "Public can view post assets"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'post-assets');

create policy "Admin can upload post assets"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'post-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  );

create policy "Admin can update post assets"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'post-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  )
  with check (
    bucket_id = 'post-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  );

create policy "Admin can delete post assets"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'post-assets'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  );

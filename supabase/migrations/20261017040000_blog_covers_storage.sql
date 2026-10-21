-- Public blog cover images. Anyone can view objects in this bucket.
-- Upload, update, and delete require public.is_admin(), not merely an authenticated session.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'blog-covers',
  'blog-covers',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp', 'image/avif']
)
on conflict (id) do update
set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Public can view blog covers" on storage.objects;
drop policy if exists "Admin can upload blog covers" on storage.objects;
drop policy if exists "Admin can update blog covers" on storage.objects;
drop policy if exists "Admin can delete blog covers" on storage.objects;

create policy "Public can view blog covers"
  on storage.objects
  for select
  to anon, authenticated
  using (bucket_id = 'blog-covers');

create policy "Admin can upload blog covers"
  on storage.objects
  for insert
  to authenticated
  with check (
    bucket_id = 'blog-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  );

create policy "Admin can update blog covers"
  on storage.objects
  for update
  to authenticated
  using (
    bucket_id = 'blog-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  )
  with check (
    bucket_id = 'blog-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  );

create policy "Admin can delete blog covers"
  on storage.objects
  for delete
  to authenticated
  using (
    bucket_id = 'blog-covers'
    and public.is_admin()
    and (storage.foldername(name))[1] = 'posts'
  );

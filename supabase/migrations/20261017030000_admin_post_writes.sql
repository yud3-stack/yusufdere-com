-- Admin writes for posts and categories.
-- Being signed in is not enough. public.is_admin() is true only when
-- auth.uid() is listed in public.admin_users.
-- The API roles cannot read or edit that table. Add the admin row from the SQL editor.

create table public.admin_users (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

revoke all on table public.admin_users from anon, authenticated;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.admin_users
    where user_id = auth.uid()
  );
$$;

revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

grant insert, update, delete on table public.posts to authenticated;
grant insert, update on table public.categories to authenticated;

create policy "Admin can read all posts"
  on public.posts
  for select
  to authenticated
  using (public.is_admin());

create policy "Admin can insert posts"
  on public.posts
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can update posts"
  on public.posts
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admin can delete posts"
  on public.posts
  for delete
  to authenticated
  using (public.is_admin());

create policy "Admin can insert categories"
  on public.categories
  for insert
  to authenticated
  with check (public.is_admin());

create policy "Admin can update categories"
  on public.categories
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

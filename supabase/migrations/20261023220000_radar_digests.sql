-- Weekly software Radar digests for the personal admin hub.
-- Admin-only reads and writes via public.is_admin().

create table public.radar_digests (
  id uuid primary key default gen_random_uuid(),
  week_start date not null,
  summary text not null,
  items jsonb not null default '[]'::jsonb,
  follow_ups jsonb not null default '[]'::jsonb,
  sources_used text[] not null default '{}',
  model text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint radar_digests_week_start_key unique (week_start)
);

create trigger radar_digests_set_updated_at
  before update on public.radar_digests
  for each row
  execute function public.set_updated_at();

alter table public.radar_digests enable row level security;

revoke all on table public.radar_digests from anon, authenticated;
grant select, insert, update, delete on table public.radar_digests to authenticated;

create policy radar_digests_admin_select
  on public.radar_digests
  for select
  to authenticated
  using (public.is_admin());

create policy radar_digests_admin_insert
  on public.radar_digests
  for insert
  to authenticated
  with check (public.is_admin());

create policy radar_digests_admin_update
  on public.radar_digests
  for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy radar_digests_admin_delete
  on public.radar_digests
  for delete
  to authenticated
  using (public.is_admin());

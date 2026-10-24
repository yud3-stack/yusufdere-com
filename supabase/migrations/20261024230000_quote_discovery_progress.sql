begin;
create table public.quote_discovery_progress (
  author text primary key,
  next_index integer not null default 0 check (next_index >= 0),
  details jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);
alter table public.quote_discovery_progress enable row level security;
revoke all on public.quote_discovery_progress from anon, authenticated;
grant select, insert, update on public.quote_discovery_progress to authenticated;
grant all on public.quote_discovery_progress to service_role;
create policy quote_discovery_progress_admin on public.quote_discovery_progress
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
create trigger quote_discovery_progress_updated before update on public.quote_discovery_progress
  for each row execute function public.set_updated_at();
commit;

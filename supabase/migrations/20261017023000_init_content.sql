-- Content tables for the public blog and project pages.
-- Run once. Public reads are limited to published rows. No write policies yet.

create extension if not exists pgcrypto;

create type public.content_status as enum ('draft', 'published');

create table public.categories (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null,
  created_at timestamptz not null default now(),
  constraint categories_slug_key unique (slug)
);

create table public.posts (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  excerpt text,
  content text not null,
  cover_image text,
  category_id uuid,
  tags text[] not null default '{}',
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint posts_slug_key unique (slug),
  constraint posts_category_id_fkey
    foreign key (category_id) references public.categories (id) on delete set null
);

create table public.projects (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  slug text not null,
  description text not null,
  content text,
  cover_image text,
  technologies text[] not null default '{}',
  github_url text,
  live_url text,
  featured boolean not null default false,
  status public.content_status not null default 'draft',
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint projects_slug_key unique (slug)
);

create index posts_category_id_idx on public.posts (category_id);

create index posts_published_at_idx
  on public.posts (published_at desc)
  where status = 'published';

create index projects_published_listing_idx
  on public.projects (featured desc, published_at desc)
  where status = 'published';

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger posts_set_updated_at
  before update on public.posts
  for each row
  execute function public.set_updated_at();

create trigger projects_set_updated_at
  before update on public.projects
  for each row
  execute function public.set_updated_at();

grant usage on schema public to anon, authenticated;
grant select on public.categories, public.posts, public.projects to anon, authenticated;
revoke insert, update, delete on public.categories, public.posts, public.projects from anon, authenticated;

alter table public.categories enable row level security;
alter table public.posts enable row level security;
alter table public.projects enable row level security;

create policy "Public can read categories"
  on public.categories
  for select
  to anon, authenticated
  using (true);

create policy "Public can read published posts"
  on public.posts
  for select
  to anon, authenticated
  using (status = 'published');

create policy "Public can read published projects"
  on public.projects
  for select
  to anon, authenticated
  using (status = 'published');

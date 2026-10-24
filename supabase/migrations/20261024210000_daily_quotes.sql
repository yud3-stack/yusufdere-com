-- Source discovery is private; only reviewed translations can enter publication.
begin;
create table public.quote_candidates (
  id text primary key check (id ~ '^[a-f0-9]{64}$'),
  original text not null check (char_length(original) between 10 and 600),
  translation text check (char_length(translation) between 10 and 320),
  author text not null,
  author_detail text not null default '',
  source_url text not null check (source_url like 'https://%'),
  source_title text not null,
  source_label text not null default '',
  source_note text not null default 'Türkçe çeviri · Özgün metin kaynakta',
  discovery_url text,
  discovery_revision bigint,
  source_matched boolean not null default false,
  portrait_src text not null default '',
  portrait_credit text not null default '',
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  approved_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (status <> 'approved' or (translation is not null and approved_at is not null and source_matched)),
  check (portrait_src = '' or portrait_credit <> '')
);
create index quote_candidates_review on public.quote_candidates (status, created_at desc);
create trigger quote_candidates_updated before update on public.quote_candidates
  for each row execute function public.set_updated_at();

create table public.quote_publications (
  day date primary key,
  quote_id text not null references public.quote_candidates(id),
  content jsonb not null,
  created_at timestamptz not null default now()
);
create index quote_publications_quote on public.quote_publications (quote_id, day desc);

alter table public.quote_candidates enable row level security;
alter table public.quote_publications enable row level security;
revoke all on public.quote_candidates, public.quote_publications from anon, authenticated;
grant select, insert, update on public.quote_candidates to authenticated;
grant select on public.quote_publications to anon, authenticated;
grant all on public.quote_candidates, public.quote_publications to service_role;
create policy quote_candidates_admin on public.quote_candidates for all to authenticated
  using (public.is_admin()) with check (public.is_admin());
create policy quote_publications_read on public.quote_publications for select to anon, authenticated using (true);

-- No date parameter: public callers can only allocate the real Istanbul day.
-- The snapshot and advisory lock prevent different quotes during concurrent calls.
create function public.current_daily_quote() returns jsonb
language plpgsql security definer set search_path = '' as $$
declare
  today date := (now() at time zone 'Europe/Istanbul')::date;
  chosen public.quote_candidates%rowtype;
  snapshot jsonb;
begin
  select content into snapshot from public.quote_publications where day = today;
  if snapshot is not null then return jsonb_build_object('date', today, 'quote', snapshot); end if;
  perform pg_advisory_xact_lock(936204, today - date '2000-01-01');
  select content into snapshot from public.quote_publications where day = today;
  if snapshot is not null then return jsonb_build_object('date', today, 'quote', snapshot); end if;
  select c.* into chosen from public.quote_candidates c
    left join (select quote_id, max(day) as last_day from public.quote_publications group by quote_id) p on p.quote_id = c.id
    where c.status = 'approved'
    order by p.last_day asc nulls first, c.approved_at asc, c.id asc limit 1;
  if chosen.id is null then return null; end if;
  snapshot := jsonb_build_object(
    'id', chosen.id, 'text', chosen.translation, 'original', chosen.original,
    'author', chosen.author, 'authorDetail', chosen.author_detail,
    'sourceTitle', chosen.source_title, 'sourceLabel', chosen.source_label,
    'sourceNote', chosen.source_note, 'sourceUrl', chosen.source_url,
    'portraitSrc', chosen.portrait_src, 'portraitCredit', chosen.portrait_credit,
    'discoveryUrl', chosen.discovery_url
  );
  insert into public.quote_publications (day, quote_id, content) values (today, chosen.id, snapshot);
  return jsonb_build_object('date', today, 'quote', snapshot);
end;
$$;
revoke all on function public.current_daily_quote() from public;
grant execute on function public.current_daily_quote() to anon, authenticated, service_role;

-- Seeded verified fallback entries are appended below, with the same fingerprint
-- as the importer so repeated scans cannot create duplicates.

insert into public.quote_candidates (id, original, translation, author, author_detail, source_url, source_title, source_label, source_note, source_matched, portrait_src, portrait_credit, status, approved_at) values
('679fc68715ca72665a6369a878ba4fe46f1b2b71706380e3ee4a1f3cd1889051', 'Program testing may convincingly demonstrate the presence of bugs, but can never demonstrate their absence.', 'Program testi, hataların varlığını gösterebilir; yokluğunu asla.', 'Edsger W. Dijkstra', 'Bilgisayar bilimci', 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD10xx/EWD1036.html', 'On the cruelty of really teaching computing science · EWD 1036', 'E. W. Dijkstra Archive · EWD 1036', 'Türkçe çeviri · Özgün metin kaynakta', true, '/images/quotes/edsger-dijkstra.jpg', 'Hamilton Richards · CC BY-SA 3.0', 'approved', now() + interval '0 seconds'),
('3bedccf43da3fc29a44f126e4136c9c667b0b56474e07ee4db4ceb7b5465f4b9', 'The tools we use have a profound (and devious!) influence on our thinking habits', 'Kullandığımız araçlar, düşünme alışkanlıklarımızı derinden ve sinsice etkiler.', 'Edsger W. Dijkstra', 'Bilgisayar bilimci', 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD04xx/EWD498.html', 'How do we tell truths that might hurt? · EWD 498', 'E. W. Dijkstra Archive · EWD 498', 'Türkçe çeviri · Cümleden alıntı', true, '/images/quotes/edsger-dijkstra.jpg', 'Hamilton Richards · CC BY-SA 3.0', 'approved', now() + interval '1 seconds'),
('ef0b60eda3caec65d0944e22a1cd3958f0fde707d5bd6fe25048c89cc97c191c', 'elegance is not a dispensable luxury', 'Zarafet, vazgeçilebilir bir lüks değildir.', 'Edsger W. Dijkstra', 'Bilgisayar bilimci', 'https://www.cs.utexas.edu/~EWD/transcriptions/EWD12xx/EWD1237.html', 'Elegance and effective reasoning · EWD 1237', 'E. W. Dijkstra Archive · EWD 1237', 'Türkçe çeviri · Cümleden alıntı', true, '/images/quotes/edsger-dijkstra.jpg', 'Hamilton Richards · CC BY-SA 3.0', 'approved', now() + interval '2 seconds')
on conflict (id) do nothing;

commit;

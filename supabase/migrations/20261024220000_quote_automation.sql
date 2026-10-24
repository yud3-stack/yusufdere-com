begin;
alter table public.quote_candidates
  add column portrait_source_url text,
  add column portrait_license_url text,
  add column auto_approved boolean not null default false,
  add column automation_note text,
  add column automation_checked_at timestamptz;

-- Keep existing daily snapshots; add complete photo credits to future ones.
create or replace function public.current_daily_quote() returns jsonb
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
    'portraitSourceUrl', chosen.portrait_source_url, 'portraitLicenseUrl', chosen.portrait_license_url,
    'discoveryUrl', chosen.discovery_url
  );
  insert into public.quote_publications (day, quote_id, content) values (today, chosen.id, snapshot);
  return jsonb_build_object('date', today, 'quote', snapshot);
end;
$$;
commit;

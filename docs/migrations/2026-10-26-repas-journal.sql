-- Migration additive (étape 14) : journal alimentaire détaillé, un aliment par ligne. Appliquée le 26/10/2026
-- (repas_journal_etape_14). Les quantités de nutriments sont calculées à l'enregistrement depuis `aliments`
-- (valeurs pour 100 g × quantité) et figées : une correction de la base d'aliments ne réécrit pas l'historique.
create table if not exists public.repas_journal (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  date_repas date not null default current_date,
  moment text not null check (moment in ('petit_dejeuner', 'dejeuner', 'diner', 'collation', 'avant_seance', 'pendant_seance', 'apres_seance')),
  heure timestamptz not null default now(),
  aliment_id uuid references public.aliments(id) on delete set null,
  nom text not null check (char_length(nom) between 1 and 120),
  quantite_g numeric not null check (quantite_g > 0 and quantite_g <= 3000),
  calories numeric check (calories >= 0),
  proteines_g numeric check (proteines_g >= 0),
  glucides_g numeric check (glucides_g >= 0),
  lipides_g numeric check (lipides_g >= 0),
  fibres_g numeric check (fibres_g >= 0),
  sucres_g numeric check (sucres_g >= 0),
  -- fer_mg, calcium_mg, magnesium_mg, potassium_mg, zinc_mg, sodium_mg, vitamine_c_mg, vitamine_d_ug, vitamine_b12_ug, omega3_mg
  micros jsonb not null default '{}'::jsonb,
  source text not null default 'aliment' check (source in ('aliment', 'saisie_libre')),
  created_at timestamptz not null default now()
);
create index if not exists repas_journal_user_date_idx on public.repas_journal(user_id, date_repas);
create index if not exists repas_journal_aliment_idx on public.repas_journal(aliment_id);
alter table public.repas_journal enable row level security;
create policy repas_journal_own on public.repas_journal
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

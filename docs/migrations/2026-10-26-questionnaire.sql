-- Migration additive pour le questionnaire complet (étape 10). Appliquée le 26/10/2026 (questionnaire_complet_etape_10).
-- Aucune suppression, aucune modification de colonne existante.

-- 1. Questions déjà posées : reprise du questionnaire, avancement, « plus tard », ne jamais reposer.
create table if not exists public.questions_posees (
  user_id uuid not null references public.users(id) on delete cascade,
  question_id text not null,                       -- identifiant du questionnaire (TC41, MU04…)
  statut text not null check (statut in ('repondue', 'passee', 'plus_tard')),
  moment text check (moment in ('inscription', 'questionnaire', 'au_fil_des_jours')),
  presentee_le timestamptz not null default now(),
  repondue_le timestamptz,
  primary key (user_id, question_id)
);
alter table public.questions_posees enable row level security;
create policy questions_posees_own on public.questions_posees
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 2. Périodes sans entraînement (TC74).
create table if not exists public.indisponibilites_athlete (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  debut date not null,
  fin date not null check (fin >= debut),
  raison text check (raison in ('vacances', 'examens', 'deplacement', 'autre')),
  created_at timestamptz not null default now()
);
alter table public.indisponibilites_athlete enable row level security;
create policy indisponibilites_own on public.indisponibilites_athlete
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

-- 3. Comptes parents (TC03, moins de 15 ans).
create table if not exists public.comptes_parents (
  id uuid primary key default gen_random_uuid(),
  enfant_id uuid not null references public.users(id) on delete cascade,
  parent_email text not null,
  parent_user_id uuid references public.users(id) on delete set null,
  valide_le timestamptz,
  created_at timestamptz not null default now()
);
alter table public.comptes_parents enable row level security;
create policy comptes_parents_lecture on public.comptes_parents
  for select to authenticated
  using ((select auth.uid()) in (enfant_id, parent_user_id));
create policy comptes_parents_creation on public.comptes_parents
  for insert to authenticated
  with check ((select auth.uid()) = enfant_id);

-- 4. Colonnes manquantes.
alter table public.sante_athlete add column if not exists signaux_effort jsonb;       -- TC80, TC81 + date
alter table public.user_profiles add column if not exists acces_piste boolean;        -- TC71
alter table public.preferences_athlete add column if not exists recuperation text[];  -- TC128

-- 5. Types de tests manquants (records de course, temps de nage).
insert into public.types_tests (slug, nom, categorie, unite, plus_haut_mieux, par_exercice, sports)
values
  ('temps_5km', 'Temps sur 5 km', 'aerobie', 's', false, false, array['course_a_pied', 'trail', 'triathlon']),
  ('temps_10km', 'Temps sur 10 km', 'aerobie', 's', false, false, array['course_a_pied', 'trail', 'triathlon']),
  ('temps_semi', 'Temps sur semi-marathon', 'aerobie', 's', false, false, array['course_a_pied', 'trail', 'triathlon']),
  ('temps_marathon', 'Temps sur marathon', 'aerobie', 's', false, false, array['course_a_pied', 'trail', 'triathlon']),
  ('nage_100m', 'Temps sur 100 m crawl', 'aerobie', 's', false, false, array['natation', 'triathlon']),
  ('nage_200m', 'Temps sur 200 m crawl', 'aerobie', 's', false, false, array['natation', 'triathlon']),
  ('nage_400m', 'Temps sur 400 m crawl', 'aerobie', 's', false, false, array['natation', 'triathlon'])
on conflict (slug) do nothing;

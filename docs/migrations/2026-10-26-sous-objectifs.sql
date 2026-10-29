-- Migration additive (étape 12) : étapes intermédiaires vers l'objectif principal. Appliquée le 26/10/2026
-- (sous_objectifs_etape_12). Aucune suppression, aucune modification de l'existant.
create table if not exists public.sous_objectifs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.users(id) on delete cascade,
  sport_id uuid references public.sports(id) on delete set null,
  -- Objectif principal visé (compétition A), facultatif.
  evenement_id uuid references public.evenements_athlete(id) on delete set null,
  titre text not null check (char_length(titre) between 1 and 120),
  type text not null default 'performance' check (type in ('competition', 'performance', 'volume', 'technique', 'autre')),
  -- Indicateur suivi : slug de types_tests (ex. temps_marathon, 1rm) ; exercice si le test en demande un.
  indicateur text,
  exercice_slug text,
  valeur_depart numeric,
  valeur_cible numeric,
  unite text,
  -- Rythme visé, en % par semaine (ex. 2,5 % de charge en plus chaque semaine).
  progression_hebdo_pct numeric check (progression_hebdo_pct is null or progression_hebdo_pct between -50 and 50),
  date_debut date not null default current_date,
  date_cible date not null,
  statut text not null default 'actif' check (statut in ('propose', 'actif', 'atteint', 'abandonne')),
  -- Qui l'a créée : l'athlète, ou le coach (proposition à accepter).
  origine text not null default 'athlete' check (origine in ('athlete', 'coach')),
  raison text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (date_cible >= date_debut)
);
create index if not exists sous_objectifs_user_idx on public.sous_objectifs(user_id, date_cible);
create index if not exists sous_objectifs_evenement_idx on public.sous_objectifs(evenement_id);
create index if not exists sous_objectifs_sport_idx on public.sous_objectifs(sport_id);
alter table public.sous_objectifs enable row level security;
create policy sous_objectifs_own on public.sous_objectifs
  for all to authenticated
  using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

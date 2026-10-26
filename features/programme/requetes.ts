import { keepPreviousData, useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

import { cles } from './cles';
import { DELAI_PREPARATION_MS } from './constantes';
import { estSeanceIntrouvable } from './etatRequete';
import type { Adaptation, Calendrier, DetailSeanceProgramme, Evenement, FicheExercice, Legende, Programme } from './types';

/** `GET /programme` : programme actif et ses blocs (frise). */
export function useProgramme() {
  return useQuery({ queryKey: cles.programme, queryFn: () => api.get<Programme>('/programme') });
}

/** `GET /calendrier?mois=` : le mois jour par jour. Le mois précédent reste affiché pendant le chargement du suivant. */
export function useCalendrier(mois: string, actif = true) {
  return useQuery({
    queryKey: cles.calendrier(mois),
    queryFn: () => api.get<Calendrier>(`/calendrier?mois=${mois}`),
    placeholderData: keepPreviousData,
    enabled: actif,
  });
}

/** `GET /calendrier/legende` : référentiel stable (codes → libellés), lu une fois par session. */
export function useLegende() {
  return useQuery({
    queryKey: cles.legende,
    queryFn: () => api.get<Legende>('/calendrier/legende'),
    staleTime: Infinity,
  });
}

/** `GET /evenements` : compétitions à venir et passées. */
export function useEvenements() {
  return useQuery({ queryKey: cles.evenements, queryFn: () => api.get<Evenement[]>('/evenements') });
}

/** `GET /programme/adaptations` : les 30 derniers jours. */
export function useAdaptations() {
  return useQuery({ queryKey: cles.adaptations, queryFn: () => api.get<Adaptation[]>('/programme/adaptations') });
}

/**
 * `GET /programme/seances/:id`. Le serveur répond 202 avec `en_preparation` pendant la génération
 * de l'aperçu : on redemande toutes les quelques secondes jusqu'à ce qu'il soit prêt.
 * Séance inconnue : pas de nouvel essai, l'écran affiche « Séance introuvable ».
 */
export function useSeanceProgramme(id: string | undefined) {
  return useQuery({
    queryKey: cles.seance(id ?? ''),
    queryFn: () => api.get<DetailSeanceProgramme>(`/programme/seances/${id}`, { delaiMs: 90_000 }),
    enabled: Boolean(id),
    retry: (essais, erreur) => !estSeanceIntrouvable(erreur) && essais < 1,
    refetchInterval: (requete) => (requete.state.data?.en_preparation ? DELAI_PREPARATION_MS : false),
  });
}

const COLONNES_FICHE =
  'slug, nom, consignes_cles, groupes_musculaires_primaires, erreurs_communes, etapes, conseils_execution, image_url, video_url';
/** Colonnes lues par le serveur lui-même (sortiesProgramme.js) : repli si une colonne détaillée manque en base. */
const COLONNES_FICHE_MINIMALES = 'slug, nom, consignes_cles, groupes_musculaires_primaires, image_url, video_url';
/** Code PostgreSQL « colonne inconnue ». */
const COLONNE_INCONNUE = '42703';

async function lireFiche(slug: string, colonnes: string) {
  return supabase.from('exercices').select(colonnes).eq('slug', slug).maybeSingle();
}

/** Fiche technique lue en direct dans la table `exercices` (catalogue public, RLS). `null` si inconnue. */
export function useFicheExercice(slug: string | undefined) {
  return useQuery({
    queryKey: cles.exercice(slug ?? ''),
    enabled: Boolean(slug),
    staleTime: 60 * 60_000,
    queryFn: async (): Promise<FicheExercice | null> => {
      let reponse = await lireFiche(slug as string, COLONNES_FICHE);
      if (reponse.error?.code === COLONNE_INCONNUE) reponse = await lireFiche(slug as string, COLONNES_FICHE_MINIMALES);
      if (reponse.error) throw reponse.error;
      return (reponse.data as unknown as FicheExercice | null) ?? null;
    },
  });
}

import type { TestAthlete } from '@/features/progres/types';
import { supabase } from '@/lib/supabase';

import type { Destination, Question, SportSlug, ValeurReponse } from './types';

type Ligne = Record<string, unknown>;

/** Ce que l'app relit pour savoir ce qui est déjà connu (lignes de l'athlète, RLS). */
export type DonneesQuestionnaire = {
  profil: Ligne | null;
  sportProfil: { id: string; ambition: string | null; profil_specifique: Ligne | null; sport: SportSlug | null } | null;
  preferencesAthlete: Ligne | null;
  preferencesNutrition: Ligne | null;
  sante: Ligne | null;
  /** `question_id` → statut (`repondue`, `passee`, `plus_tard`). */
  posees: Record<string, string>;
};

const COLONNES_PROFIL =
  'date_naissance, taille_cm, poids_kg, lateralite, activite_quotidienne, sommeil_heures_habituel, niveau_stress_habituel, ' +
  'annees_pratique, duree_seance_minutes, contexte_vie, style_coaching, preference_variete, acces_piscine, acces_velo, ' +
  'acces_piste, contre_indications';

function verifier<T>(reponse: { data: T; error: unknown }): T {
  if (reponse.error) throw reponse.error;
  return reponse.data;
}

export async function lireDonnees(userId: string, consentementSante: boolean): Promise<DonneesQuestionnaire> {
  const [profil, sportProfil, preferencesAthlete, preferencesNutrition, sante, posees] = await Promise.all([
    supabase.from('user_profiles').select(COLONNES_PROFIL).eq('user_id', userId).maybeSingle(),
    supabase
      .from('user_sport_profiles')
      .select('id, ambition, profil_specifique, sports!user_sport_profiles_sport_id_fkey(slug)')
      .eq('user_id', userId)
      .eq('actif', true)
      .order('priorite', { ascending: true, nullsFirst: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('preferences_athlete').select('*').eq('user_id', userId).maybeSingle(),
    supabase.from('preferences_nutrition').select('*').eq('user_id', userId).maybeSingle(),
    consentementSante
      ? supabase.from('sante_athlete').select('allergies, medicaments, pathologies_chroniques, signaux_effort').eq('user_id', userId).maybeSingle()
      : Promise.resolve({ data: null, error: null }),
    supabase.from('questions_posees').select('question_id, statut').eq('user_id', userId),
  ]);
  const sp = verifier(sportProfil) as { id: string; ambition: string | null; profil_specifique: Ligne | null; sports: { slug: string } | null } | null;
  return {
    profil: verifier(profil) as Ligne | null,
    sportProfil: sp
      ? { id: sp.id, ambition: sp.ambition, profil_specifique: sp.profil_specifique, sport: (sp.sports?.slug ?? null) as SportSlug | null }
      : null,
    preferencesAthlete: verifier(preferencesAthlete) as Ligne | null,
    preferencesNutrition: verifier(preferencesNutrition) as Ligne | null,
    sante: verifier(sante) as Ligne | null,
    posees: Object.fromEntries((verifier(posees) ?? []).map((l) => [l.question_id, l.statut])),
  };
}

function estVide(v: unknown): boolean {
  return v === null || v === undefined || (Array.isArray(v) && v.length === 0) || v === '';
}

function lireDestination(d: Destination, donnees: DonneesQuestionnaire): unknown {
  switch (d.kind) {
    case 'profil':
      return donnees.profil?.[d.colonne];
    case 'profilJson':
      return (donnees.profil?.[d.colonne] as Ligne | null | undefined)?.[d.cle];
    case 'table':
      return ({ preferences_athlete: donnees.preferencesAthlete, preferences_nutrition: donnees.preferencesNutrition, sante_athlete: donnees.sante })[
        d.table
      ]?.[d.colonne];
    case 'tableJson':
      return (donnees.sante?.[d.colonne] as Ligne | null | undefined)?.[d.cle];
    case 'sport':
      return donnees.sportProfil?.profil_specifique?.[d.cle];
    case 'poids':
      return donnees.profil?.poids_kg;
    case 'test':
      return undefined;
  }
}

/** Valeur déjà connue pour une question (colonne remplie, ou résultat de test du bon type et du bon exercice). */
export function valeurConnue(q: Question, donnees: DonneesQuestionnaire, tests: TestAthlete[]): ValeurReponse | undefined {
  const d = q.destination;
  if (d.kind === 'test') {
    const t = tests.find((x) => x.types_tests?.slug === d.type && (!d.exercice || x.exercices?.slug === d.exercice));
    return t ? t.valeur : undefined;
  }
  const brut = lireDestination(d, donnees);
  // Les tableaux vides valent « aucun » seulement si l'athlète a répondu (sinon : pas encore demandé).
  if (estVide(brut) && !(Array.isArray(brut) && donnees.posees[q.id] === 'repondue')) return undefined;
  const conversion = 'depuisBase' in d ? d.depuisBase : undefined;
  return conversion ? conversion(brut) : (brut as ValeurReponse);
}

/** Âge en années révolues à partir de `user_profiles.date_naissance`. */
export function ageDepuis(dateNaissance: unknown): number | null {
  if (typeof dateNaissance !== 'string') return null;
  const naissance = new Date(`${dateNaissance}T12:00:00`);
  const maintenant = new Date();
  let age = maintenant.getFullYear() - naissance.getFullYear();
  const avantAnniversaire =
    maintenant.getMonth() < naissance.getMonth() ||
    (maintenant.getMonth() === naissance.getMonth() && maintenant.getDate() < naissance.getDate());
  if (avantAnniversaire) age -= 1;
  return Number.isFinite(age) ? age : null;
}

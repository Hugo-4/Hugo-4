import type { PlanNutrition } from '@/features/nutrition/types';

/**
 * Réponses du serveur coachia-agents-v6 utilisées par l'écran Aujourd'hui.
 * Source : agents/programme/sortiesProgramme.js (accueil, detailSeance),
 * tools/presentationSeance.js (resumeSeance, presenterExercices), routes/athlete.js (/nutrition/jour).
 * Seuls les champs affichés par l'app sont typés.
 */

export type StatutSeanceCode = 'a_venir' | 'prete' | 'en_cours' | 'faite' | 'manquee' | 'reportee' | 'annulee';

export type ResumeSeance = {
  id: string;
  date: string;
  creneau: 'matin' | 'midi' | 'soir' | null;
  heure: string | null;
  sport: { code: string; nom: string; slug: string | null };
  type: { code: string; libelle: string };
  intensite: { niveau: number; libelle: string; rpe_cible: number | null };
  duree_min: number | null;
  titre: string;
  statut: { code: StatutSeanceCode; libelle: string; aujourdhui?: boolean };
  badges: string[];
  modification: { portee: string; raison: string; le: string } | null;
};

export type ExercicePresente = {
  ordre: number;
  bloc: string;
  exercice: { slug: string; nom: string };
  series: number | null;
  reps: number | string | null;
  charge_kg: number | null;
  rir_cible: number | null;
  duree_s: number | null;
  distance_m: number | null;
};

export type DetailSeance = {
  source: 'finale' | 'apercu';
  nom?: string;
  lieu?: { nom?: string; environnement?: string } | string | null;
  exercices?: { blocs: { bloc: string; libelle: string; exercices: ExercicePresente[] }[]; totaux: { exercices: number } };
  en_preparation?: boolean;
};

export type SeanceDuJour = ResumeSeance & { detail: DetailSeance | null };

export type JourSemaine = {
  date: string;
  jour: string;
  aujourdhui: boolean;
  seances: ResumeSeance[];
};

export type Accueil = {
  date: string;
  aujourdhui: { date: string; repos: boolean; seances: SeanceDuJour[] };
  demain: { date: string; repos: boolean; seances: ResumeSeance[] };
  semaine: {
    debut: string;
    fin: string;
    jours: JourSemaine[];
    stats: { prevues: number; faites: number; minutes_prevues: number };
  };
  bloc: {
    nom: string;
    phase: string;
    semaine: number | null;
    nb_semaines: number | null;
    semaine_allegee: boolean;
  } | null;
  prochain_evenement: { nom: string; date: string; priorite: string; jours_restants: number } | null;
  adaptation_proposee: { id: string; categorie: string; raison: string | null; explication: string | null } | null;
  apercus_en_preparation: number;
};

export type NutritionJour = {
  seance: { type: string; creneau: string; duree_min: number } | null;
  nutrition: PlanNutrition;
};

/** Check-in du jour (table `checkins_forme`) : score et recommandation calculés par la base. */
export type CheckinDuJour = {
  id: string;
  score_forme: number | null;
  recommandation: 'intensifier' | 'maintenir' | 'alleger' | 'recuperation_active' | 'repos_complet' | null;
  recommandation_raison: string | null;
  energie: number | null;
  sommeil_ressenti: number | null;
  courbatures: number | null;
  motivation: number | null;
  stress_ressenti: number | null;
  /** Relus pour préremplir « Refaire mon check-in » (sinon le renvoi les effacerait). */
  douleurs: string[] | null;
  cause_ponctuelle: string | null;
  duree_disponible_min: number | null;
  lieu_id: string | null;
};

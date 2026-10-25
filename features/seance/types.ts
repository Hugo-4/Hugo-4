import type { ExercicePresente, ResumeSeance } from '@/features/accueil/types';

/**
 * Séance finale renvoyée par le serveur (detailSeance, source « finale ») :
 * aujourd'hui par `GET /programme/seances/:id` une fois la séance générée,
 * demain par `POST /programme/seances/:id/demarrer` (route à ajouter côté serveur).
 * Source : agents/programme/sortiesProgramme.js et tools/presentationSeance.js (presenterExercices).
 */
export type ExerciceSeance = Omit<ExercicePresente, 'exercice'> & {
  exercice: {
    slug: string;
    nom: string;
    muscles: string[];
    consignes: string[];
    type_mesure: string | null;
  };
  rpe_cible: number | null;
  repos_s: number | null;
  tempo: string | null;
  consigne: string | null;
  /** Ligne `exercices_seance` : obligatoire pour envoyer les séries. */
  exercice_seance_id: string;
};

export type SeanceDemarree = {
  source: 'finale';
  seance_finale_id: string;
  seance: ResumeSeance;
  nom: string;
  lieu: string | { nom?: string } | null;
  exercices: {
    blocs: { bloc: string; libelle: string; exercices: ExerciceSeance[] }[];
    totaux: { exercices: number };
  };
};

/** Corps de `PUT /exercices-seance/:id/series` (une ligne par série). */
export type SerieRealisee = {
  serie: number;
  reps: number | null;
  charge_kg: number | null;
  rpe: number | null;
  duree_sec?: number | null;
  complete: boolean;
};

/** Réponse de `POST /serie-suivante` (tools/autoregulation.js, ajusterSerieSuivante). */
export type SerieSuivante = { charge_kg: number | null; message: string };

/** Corps de `POST /seances/:id/feedback`. */
export type RetourSeance = {
  rpe: number;
  duree_reelle_min: number;
  niveau_fatigue_apres?: number;
  douleurs?: string[];
  commentaire?: string;
};

export type DouleurSignalee = { zone: string; intensite: number; exercice: string | null };

export type Vue = 'exercice' | 'liste';

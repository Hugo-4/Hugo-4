/**
 * Réponses du serveur coachia-agents-v6 utilisées par l'onglet Programme (étape 7).
 * Sources : routes/athlete.js (gestionnaires), agents/programme/sortiesProgramme.js (calendrier, detailSeance),
 * tools/presentationSeance.js (legende, resumeSeance, presenterExercices). Seuls les champs affichés sont typés.
 */
import type { ExercicePresente, ResumeSeance } from '@/features/accueil/types';

// ─── GET /calendrier?mois=AAAA-MM ──────────────────────────────────────────

/** Séance du programme dans une case du calendrier (+ ce qui a été réalisé si elle est faite). */
export type SeanceCalendrier = ResumeSeance & {
  hors_programme?: false;
  realise?: { duree_min: number | null; rpe: number | null };
};

/** Séance faite hors programme (séance libre, autre sport) : pas de détail à ouvrir. */
export type SeanceHorsProgramme = Omit<ResumeSeance, 'id' | 'creneau' | 'heure' | 'modification'> & {
  id: null;
  seance_id: string;
  hors_programme: true;
};

export type EvenementCalendrier = {
  id: string;
  nom: string;
  priorite: Priorite;
  type: TypeEvenement;
  discipline: string | null;
};

export type JourCalendrier = {
  date: string;
  aujourdhui: boolean;
  passe: boolean;
  seances: (SeanceCalendrier | SeanceHorsProgramme)[];
  evenements: EvenementCalendrier[];
  repos: boolean;
};

export type BlocCalendrier = { id: string; nom: string; phase: string; date_debut: string; date_fin: string; statut: StatutBloc };

export type StatsMois = {
  seances_prevues: number;
  faites: number;
  manquees: number;
  minutes_prevues: number;
  hors_programme: number;
  /** `null` tant qu'aucune séance du mois n'est passée. */
  assiduite_pct: number | null;
};

export type Calendrier = {
  mois: string;
  debut: string;
  fin: string;
  blocs: BlocCalendrier[];
  jours: JourCalendrier[];
  stats: StatsMois;
};

// ─── GET /calendrier/legende ───────────────────────────────────────────────

/** Codes → libellés (en français, rédigés par le serveur). Les intensités ont une couleur, pas les types ni les statuts. */
export type Legende = {
  sports: { code: string; nom: string }[];
  types: { code: string; libelle: string }[];
  intensites: { niveau: number; libelle: string; rpe: string }[];
  statuts: { code: string; libelle: string }[];
  badges: { code: string; libelle: string }[];
};

// ─── GET /programme ────────────────────────────────────────────────────────

export type StatutBloc = 'en_cours' | 'a_venir' | 'termine';

export type BlocProgramme = {
  id: string;
  ordre: number;
  nom: string;
  phase: string;
  date_debut: string;
  date_fin: string;
  nb_semaines: number | null;
  /** Numéro (1…) de la semaine allégée du bloc, s'il y en a une. */
  semaine_deload: number | null;
  objectif_bloc: string | null;
  statut: StatutBloc;
};

export type Programme = {
  programme: { id: string; nom: string | null; date_debut: string; date_fin: string | null } | null;
  blocs?: BlocProgramme[];
  bloc_en_cours?: BlocProgramme | null;
};

// ─── GET /programme/seances/:id (200, ou 202 si en préparation) ────────────

export type ElementEndurance = { ordre: number; bloc: string; bloc_libelle: string; texte: string; consigne: string | null };

export type DetailSeanceProgramme = {
  seance: ResumeSeance & { focus: { code: string; libelle: string } | null };
  bloc: { nom: string; phase: string } | null;
  objectif: string | null;
  consignes: string | null;
  adaptation: { portee: string; raison: string | null } | null;
  source: 'finale' | 'apercu';
  /** Aperçu en cours de génération : réessayer quelques secondes plus tard. */
  en_preparation?: boolean;
  /** Aperçu impossible à générer pour l'instant. */
  indisponible?: boolean;
  nom?: string;
  lieu?: { nom?: string } | string | null;
  duree_estimee_min?: number | null;
  exercices?: {
    blocs: { bloc: string; libelle: string; exercices: ExercicePresente[] }[];
    totaux: { exercices: number };
  };
  endurance?: { elements: ElementEndurance[]; totaux: { duree_min: number | null; distance_km: number | null } } | null;
  realisation?: { duree_min: number | null; rpe: number | null; taux_completion: number | null } | null;
  /** Phrase du serveur sur la nature de l'aperçu (affichée telle quelle). */
  note?: string;
};

// ─── POST /programme/adapter (catégorie « deplacer ») ──────────────────────

export type ReponseAdapter = {
  portee: 'seance' | 'quelques_seances' | 'programme' | 'aucune';
  applique?: boolean;
  /** Déplacement refusé : raison rédigée par le serveur (date passée, créneau occupé…). */
  raison_refus?: string;
  /** Aucun programme ou aucune séance à adapter. */
  message?: string;
  explication?: string;
};

// ─── POST /programme/seances/:id/manquee ───────────────────────────────────

export type CategorieManque =
  | 'fatigue'
  | 'douleur'
  | 'maladie'
  | 'travail'
  | 'famille'
  | 'motivation'
  | 'meteo'
  | 'voyage'
  | 'oubli'
  | 'autre';

export type ReponseManquee = { statut: 'a_reporter' | 'sautee' };

// ─── GET /programme/adaptations (30 derniers jours) ────────────────────────

export type Adaptation = {
  id: string;
  declencheur: 'athlete' | 'agent' | 'checkin' | string;
  categorie: string;
  raison: string | null;
  portee: 'seance' | 'quelques_seances' | 'programme' | string;
  seances_modifiees: string[] | null;
  statut: 'appliquee' | 'proposee' | 'refusee' | string;
  created_at: string;
};

// ─── GET/POST /evenements, PATCH/DELETE /evenements/:id ────────────────────

export type Priorite = 'A' | 'B' | 'C';
export type TypeEvenement = 'competition' | 'combat' | 'match' | 'course' | 'test' | 'objectif_perso' | 'stage';
export type StatutEvenement = 'prevu' | 'termine' | 'annule' | 'reporte';

/** Ligne de `evenements_athlete` (+ sport) renvoyée par le serveur. */
export type Evenement = {
  id: string;
  nom: string;
  date_evenement: string;
  priorite: Priorite;
  type_evenement: TypeEvenement | null;
  discipline: string | null;
  lieu: string | null;
  notes: string | null;
  statut: StatutEvenement;
  sport_id: string | null;
  /** Écrit en direct (Supabase) : absent de CHAMPS_EVT côté serveur. */
  categorie_poids_kg?: number | null;
  sports: { slug: string; nom: string } | null;
};

/** Corps accepté par POST /evenements et PATCH /evenements/:id (aucun identifiant d'athlète). */
export type CorpsEvenement = {
  nom: string;
  date_evenement: string;
  priorite: Priorite;
  type_evenement: TypeEvenement;
  sport_slug?: string;
  discipline?: string | null;
  lieu: string | null;
  notes: string | null;
};

// ─── Table `exercices` (catalogue public, lu en direct) ────────────────────

export type FicheExercice = {
  slug: string;
  nom: string;
  consignes_cles: unknown;
  groupes_musculaires_primaires: unknown;
  erreurs_communes: unknown;
  etapes: unknown;
  conseils_execution: unknown;
  image_url: string | null;
  video_url: string | null;
};

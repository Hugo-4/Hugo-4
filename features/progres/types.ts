/**
 * Réponses du serveur coachia-agents-v6 utilisées par l'onglet Progrès.
 * Routes existantes : routes/athlete.js (GET /tests, GET /tests/types, POST /tests, GET /progressions,
 * GET /assiduite, GET /profil → charge). Routes manquantes (source fictive, `features/progres/source.ts`) :
 * format proposé dans docs/MANQUES-SERVEUR.md §5.
 */

// ─── Routes existantes ──────────────────────────────────────────────────────

/** `GET /tests/types` : un type de test (table types_tests). */
export type TypeTest = {
  slug: string;
  nom: string;
  categorie: string | null;
  unite: string | null;
  plus_haut_mieux: boolean | null;
  par_exercice: boolean | null;
  /** Texte du protocole (rédigé côté serveur) ; affiché seulement si c'est du texte. */
  protocole: unknown;
  validite_jours: number | null;
};

export type CoteTest = 'gauche' | 'droite';

/** `teste` et `declare` à la saisie ; d'autres valeurs existent en base (estimations). */
export type MethodeTest = 'teste' | 'declare' | 'estime_seance' | 'estime_montre' | 'formule';

/** `GET /tests` : un résultat (table tests_athlete), du plus récent au plus ancien. */
export type TestAthlete = {
  id: string;
  valeur: number;
  cote: CoteTest | null;
  date_test: string;
  methode: MethodeTest | string | null;
  fiabilite: number | null;
  notes: string | null;
  types_tests: { slug: string; nom: string; unite: string | null } | null;
  exercices: { slug: string; nom: string } | null;
};

/** Corps de `POST /tests` (jamais d'identifiant d'athlète : le serveur lit le jeton). */
export type NouveauTest = {
  type: string;
  valeur: number;
  exercice?: string;
  cote?: CoteTest;
  date_test?: string;
  methode?: 'teste' | 'declare';
  notes?: string;
};

/** `GET /progressions` : progression par exercice (table progressions_exercice), calculée par le serveur. */
export type Progression = {
  e1rm_recent: number | null;
  one_rep_max_kg: number | null;
  derniere_charge_kg: number | null;
  dernieres_reps: number | null;
  dernier_rpe: number | null;
  derniere_seance_date: string | null;
  /** debut | progression_rapide | progression_stable | stagnation | regression (valeurs vues côté serveur). */
  tendance: string | null;
  statut_progression: string | null;
  seances_sans_progres: number | null;
  recommandation_ia: unknown;
  exercices: { slug: string; nom: string } | null;
};

/** `GET /profil` → `charge` (fonction SQL profil_avance) : charge interne sRPE, ACWR, monotonie. */
export type ChargeActuelle = {
  acwr: number | null;
  /** sous_charge | vigilance | danger, sinon zone habituelle (décision du serveur). */
  zone: string | null;
  aigue_7j: number | null;
  monotonie: number | null;
  contrainte: number | null;
  seances_7j: number | null;
  chronique_hebdo_28j: number | null;
  jours_actifs_28j: number | null;
  donnees_suffisantes: boolean;
  jours_depuis_derniere: number | null;
};

export type ProfilAvance = { charge: ChargeActuelle | null };

/** `GET /assiduite` (fonction SQL assiduite_athlete + `lecture` + `manquees`). Seuls les champs lus sont typés. */
export type Assiduite = {
  statut: string | null;
  taux_14j: number | null;
  taux_28j: number | null;
  taux_56j?: number | null;
  faites_28j?: number | null;
  prevues_28j?: number | null;
  manquees_consecutives?: number | null;
  jours_sans_seance?: number | null;
  raisons_28j?: Record<string, number> | null;
  /** Faits rédigés pour le coach (pas affichés : textes internes du serveur). */
  lecture: string[];
};

// ─── Routes manquantes (docs/MANQUES-SERVEUR.md §5) ────────────────────────────

/** `GET /progres/records` : un record ou un jalon, fait réel daté. */
export type RecordJalon = {
  id: string;
  nature: 'record' | 'jalon';
  date: string;
  /** Rédigé par le serveur, dans la langue de l'app (« Squat barre · 1RM estimé », « 50e séance terminée »). */
  titre: string;
  valeur: number | null;
  unite: string | null;
  precedent: { valeur: number; date: string } | null;
  origine: { type: 'seance' | 'test' | 'competition' | 'programme'; id: string } | null;
};

export type NiveauGroupe = 'debutant' | 'amateur' | 'confirme' | 'pro' | 'elite';

/** Groupe de comparaison d'un percentile : toujours affiché avec lui. */
export type GroupeComparaison = {
  niveau: NiveauGroupe | string | null;
  tranche_age: string | null;
  sexe: 'homme' | 'femme' | null;
  sport: { slug: string; nom: string } | null;
  effectif: number;
};

export type QualiteNiveau = {
  qualite: string;
  libelle: string;
  /** 0-100 : part du groupe que l'athlète dépasse. */
  percentile: number;
  valeur: number;
  unite: string | null;
  test: { slug: string; date: string; methode: MethodeTest | string | null };
  groupe: GroupeComparaison;
};

/** `GET /progres/niveaux`. */
export type Niveaux = {
  qualites: QualiteNiveau[];
  manquantes: { qualite: string; libelle: string; test_conseille: { slug: string; nom: string } | null }[];
};

export type SemaineCharge = { debut: string; charge: number; seances: number; en_cours: boolean };

/** `GET /progres/charge?semaines=12` : charge par semaine (du plus ancien au plus récent) et zone optimale. */
export type ChargeSemaines = {
  unite: string;
  semaines: SemaineCharge[];
  zone_optimale: { min: number; max: number } | null;
  donnees_suffisantes: boolean;
};

export type StatutSemaine = 'reussie' | 'non_reussie' | 'pause' | 'en_cours';

export type SemaineRegularite = { debut: string; prevues: number; faites: number; statut: StatutSemaine };

/** `GET /progres/regularite?semaines=12`. */
export type Regularite = {
  /** Règle d'une semaine réussie, rédigée par le serveur. */
  regle: string | null;
  semaines: SemaineRegularite[];
  semaines_reussies: number;
  semaines_comptees: number;
  serie_en_cours: number;
  meilleure_serie: number;
};

export type Ligue = {
  id: string;
  nom: string;
  critere: string;
  critere_libelle: string;
  inscrit: boolean;
  rang: number | null;
  participants: number;
  fin: string | null;
};

export type Defi = {
  id: string;
  nom: string;
  description: string | null;
  valeur_actuelle: number;
  valeur_cible: number;
  unite: string | null;
  date_expiration: string | null;
  statut: 'en_cours' | 'complete' | 'expire';
};

/** `GET /progres/ligues` : `autorise` est faux avant 15 ans (règle appliquée aussi par le serveur). */
export type LiguesDefis = { autorise: boolean; ligues: Ligue[]; defis: Defi[] };

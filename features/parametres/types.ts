import type { Creneau, Longueur, Ton } from '@/features/inscription/constantes';

import type { REGIMES, TYPES_LIEU } from './constantes';

/** Formats des routes serveur du Profil (lus dans `coachia-agents-v6/routes/athlete.js`). */

export type Moment = 'matin' | 'midi' | 'soir' | 'indifferent';

export type StyleCoaching = {
  ton?: Ton;
  longueur?: Longueur;
  motivations?: string[];
  tutoiement?: boolean;
  emojis?: boolean;
};

/** `rappel_min_avant` : 5 à 720 min ; heures calmes au format « HH:MM ». */
export type ReglagesNotifications = {
  actives?: boolean;
  checkin?: boolean;
  rappel_min_avant?: number;
  heure_calme_debut?: string;
  heure_calme_fin?: string;
};

/** GET /preferences (colonnes de `user_profiles` + capacité de récupération calculée, en lecture). */
export type Preferences = {
  preference_variete: number | null;
  style_coaching: StyleCoaching | null;
  contexte_vie: Record<string, unknown> | null;
  moment_prefere: Moment | null;
  notifications: ReglagesNotifications | null;
  capacite_recuperation?: unknown;
};

/** PATCH /preferences : les objets sont fusionnés par le serveur, on n'envoie que ce qui change. */
export type ModificationPreferences = {
  preference_variete?: number;
  moment_prefere?: Moment;
  style_coaching?: Partial<StyleCoaching>;
  notifications?: Partial<ReglagesNotifications>;
};

/** GET /disponibilites : une ligne par jour (1 = lundi) et par moment. */
export type Disponibilite = {
  jour: number;
  creneau: Creneau;
  heure_debut: string | null; // « HH:MM » (la base peut renvoyer « HH:MM:SS »)
  duree_max_min: number;
  lieu_id: string | null;
  actif: boolean;
};

/** Corps d'un créneau de PUT /disponibilites. */
export type CreneauSaisi = {
  jour: number;
  creneau: Creneau;
  heure_debut?: string;
  duree_max_min: number;
  lieu_id?: string;
};

export type TypeLieu = (typeof TYPES_LIEU)[number];

/** GET /lieux (lieux actifs, lieu par défaut en premier). */
export type Lieu = {
  id: string;
  nom: string;
  type_lieu: TypeLieu | null;
  salle_complete: boolean | null;
  par_defaut: boolean;
  ville: string | null;
  notes: string | null;
};

export type SaisieLieu = {
  nom: string;
  type_lieu: TypeLieu;
  salle_complete: boolean;
  par_defaut: boolean;
  ville: string;
  notes: string;
};

/** GET /memoire : ce que le coach a retenu. */
export type Souvenir = {
  id: string;
  categorie: string;
  contenu: string;
  zone: string | null;
  importance: number;
  source: string | null;
  date_observation: string | null;
  expire_le: string | null;
  confirme: boolean;
  actif: boolean;
  exercices: { slug: string; nom: string } | null;
};

export type ModificationSouvenir = { confirme?: boolean; contenu?: string; actif?: boolean };

/** GET /evenements (select `*, sports(slug, nom)`). */
export type Evenement = {
  id: string;
  nom: string;
  date_evenement: string;
  date_fin: string | null;
  priorite: 'A' | 'B' | 'C';
  type_evenement: string | null;
  statut: 'prevu' | 'termine' | 'annule' | 'reporte' | null;
  sports: { slug: string; nom: string } | null;
};

/** `user_sport_profiles.echeance` (docs/API.md) : seules les clés demandées par l'objectif sont présentes. */
export type Echeance = {
  date?: string;
  epreuve?: string;
  distance?: string;
  categorie_poids_kg?: number;
  poste?: string;
};

export type Offre = 'free' | 'premium' | 'pro' | 'coach';

/** Route manquante GET /credits (docs/MANQUES-SERVEUR.md §6). */
export type Credits = {
  offre: Offre;
  periode: { debut: string; fin: string };
  inclus: number;
  utilises: number;
  restants: number;
  renouvellement_le: string;
  detail: { type: string; credits: number }[];
};

/** Route manquante GET/POST /compte/export. */
export type ExportDonnees = {
  id: string;
  statut: 'en_preparation' | 'pret' | 'expire' | 'echec';
  demande_le: string;
  pret_le: string | null;
  url: string | null;
  expire_le: string | null;
};

export type Regime = (typeof REGIMES)[number];

/** Route manquante GET/PATCH /preferences/nutrition. `allergies` : donnée de santé (consentement). */
export type PreferencesNutrition = {
  regime: Regime | null;
  repas_par_jour: number | null;
  allergies: string[];
};

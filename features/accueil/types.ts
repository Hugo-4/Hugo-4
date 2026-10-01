/**
 * Forme provisoire des données de l'écran Aujourd'hui.
 * À l'étape 4, ces types seront alignés sur la réponse réelle de `GET /accueil`
 * et `GET /nutrition/jour` (aucun champ inventé ne sera conservé).
 */

export type StatutJour = 'fait' | 'aujourdhui' | 'prevu' | 'repos';
export type NiveauCharge = 'faible' | 'optimale' | 'elevee';

export type Forme = {
  checkinFait: boolean;
  /** Score 0-100 calculé par le serveur. */
  score: number;
  libelle: string;
  sommeilMinutes: number;
  hrv: number;
  hrvEcart: number;
  ressenti: string;
  /** Phrase du coach expliquant l'adaptation du jour (jamais composée par l'app). */
  messageCoach: string;
};

export type Fatigue = {
  message: string;
  proposition: { id: string } | null;
  seanceRemplacee: { avant: string; apres: string } | null;
};

export type ExerciceApercu = {
  nom: string;
  prescription: string;
};

export type SeanceDuJour = {
  id: string;
  bloc: number;
  semaine: number;
  semainesTotal: number;
  serieSemaines: number;
  titre: string;
  dureeMinutes: number;
  rpeCible: number;
  nombreExercices: number;
  lieu: string;
  exercices: ExerciceApercu[];
};

export type ProchaineSeance = {
  titre: string;
  /** Date ISO AAAA-MM-JJ. */
  date: string;
};

export type JourSemaine = {
  /** Date ISO AAAA-MM-JJ. */
  date: string;
  statut: StatutJour;
  type: string;
};

export type Semaine = {
  jours: JourSemaine[];
  charge: { niveau: NiveauCharge; /** Position du curseur, entre 0 et 1. */ position: number };
};

export type Nutrition = {
  calories: { valeur: number; objectif: number };
  proteines: { valeur: number; objectif: number };
  glucides: { valeur: number; objectif: number };
  eau: { valeur: number; objectif: number };
  /** Aliments les plus fréquents de l'athlète à ce moment de la journée. */
  frequents: string[];
};

export type Accueil = {
  athlete: { prenom: string; initiales: string; notificationsNonLues: number };
  forme: Forme;
  fatigue: Fatigue | null;
  /** `null` = jour de repos. */
  seance: SeanceDuJour | null;
  prochaineSeance: ProchaineSeance | null;
  semaine: Semaine | null;
  nutrition: Nutrition | null;
  /** Fait réel uniquement (record, percentile). */
  record: { texte: string } | null;
};

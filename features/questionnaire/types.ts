/**
 * Questionnaire complet de l'athlète (docs/ETAPE-10-QUESTIONNAIRE.md, PDF « Questionnaire complet » du 26/10/2026).
 * Les identifiants (TC41, MU04…) sont ceux du document : ils servent de clé dans `questions_posees` et les textes.
 */

/** Sections, dans l'ordre où l'app les propose (le plus utile au programme d'abord). */
export const SECTIONS = ['valeurs', 'sport', 'historique', 'corps', 'organisation', 'sante', 'nutrition', 'preferences'] as const;
export type SectionId = (typeof SECTIONS)[number];

/** Slugs de la table `sports`. */
export type SportSlug =
  | 'musculation'
  | 'course_a_pied'
  | 'trail'
  | 'cyclisme'
  | 'natation'
  | 'triathlon'
  | 'boxe_anglaise'
  | 'mma'
  | 'football'
  | 'general';

/** Ce que l'app sait de l'athlète pour décider quelles questions poser. */
export type Contexte = {
  sport: SportSlug | null;
  age: number | null;
  ambition: string | null;
  consentementSante: boolean;
  /** Valeurs déjà connues (réponses enregistrées ou colonnes déjà remplies), par identifiant de question. */
  valeurs: Record<string, ValeurReponse | undefined>;
};

/** Réponse à une question de valeur connue (test) : valeur, ancienneté, comment elle a été obtenue. */
export type ReponseTest = {
  valeur: number;
  /** Répétitions quand la valeur est une charge de travail (1RM estimé par le serveur à partir de charge × reps). */
  repetitions?: number;
  anciennete: 'moins_3_mois' | '3_12_mois' | 'plus';
  methode: 'test' | 'montre' | 'estimation';
};

export type ValeurReponse = string | string[] | number | boolean | ReponseTest;

/** Où va la réponse. Les écritures passent par la RLS (lignes de l'athlète) ou par `POST /tests`. */
export type Destination =
  /** Colonne de `user_profiles`. */
  | { kind: 'profil'; colonne: string; versBase?: (v: ValeurReponse) => unknown; depuisBase?: (v: unknown) => ValeurReponse | undefined }
  /** Clé d'un champ JSON de `user_profiles` (fusionné avec l'existant). */
  | { kind: 'profilJson'; colonne: 'contexte_vie' | 'style_coaching'; cle: string }
  /** Colonne d'une table « une ligne par athlète » (clé `user_id`). */
  | {
      kind: 'table';
      table: 'preferences_athlete' | 'preferences_nutrition' | 'sante_athlete';
      colonne: string;
      versBase?: (v: ValeurReponse) => unknown;
      depuisBase?: (v: unknown) => ValeurReponse | undefined;
    }
  /** Clé d'un champ JSON d'une table « une ligne par athlète » (fusionné avec l'existant). */
  | { kind: 'tableJson'; table: 'sante_athlete'; colonne: 'signaux_effort'; cle: string }
  /** Clé de `user_sport_profiles.profil_specifique` du sport principal. */
  | { kind: 'sport'; cle: string }
  /** Poids : `POST /poids` (historique des pesées + `user_profiles.poids_kg`). */
  | { kind: 'poids' }
  /** Valeur connue : `POST /tests` (type de `types_tests`, exercice si le test en demande un). */
  | { kind: 'test'; type: string; exercice?: string };

export type TypeQuestion =
  /** Choix unique parmi `options`. */
  | 'unique'
  /** Choix multiple parmi `options` (au plus `max`). */
  | 'multiple'
  /** Nombre (bornes et unité). */
  | 'nombre'
  /** Valeur connue (test) : nombre ou durée, ancienneté, méthode. */
  | 'test';

/** Format de saisie d'une valeur de test. */
export type FormatTest = 'nombre' | 'duree' | 'allure' | 'charge';

export type Question = {
  id: string;
  section: SectionId;
  type: TypeQuestion;
  /** Codes des réponses (libellés : `questionnaire.options.<code>`). */
  options?: readonly string[];
  max?: number;
  nombre?: { min: number; max: number; unite: string; decimal?: boolean };
  /** Valeur connue : format de saisie et unité affichée. */
  test?: { format: FormatTest; unite: string; libelle: string };
  /** Question de santé : jamais posée sans le consentement « données de santé ». */
  sante?: boolean;
  /** Condition d'affichage. */
  si?: (c: Contexte) => boolean;
  destination: Destination;
};

/** Un bloc de 3 à 5 questions d'une même section. */
export type Bloc = {
  id: string;
  section: SectionId;
  /** Numéro du bloc dans sa section (1, 2…) et nombre de blocs de la section. */
  numero: number;
  totalSection: number;
  questions: Question[];
  faites: number;
};

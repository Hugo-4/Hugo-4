/**
 * Journal alimentaire : `journal_entrees` (une ligne par aliment) et `journal_nutrition` (totaux du jour), base
 * `aliments`. Quand `aliment_id` est fourni, un trigger de la base calcule calories, macronutriments, sodium et
 * micronutriments, et met à jour `journal_nutrition` : l'app ne les calcule pas.
 */

export const MOMENTS_REPAS = [
  'petit_dejeuner',
  'dejeuner',
  'collation',
  'diner',
  'pre_entrainement',
  'pendant_entrainement',
  'post_entrainement',
] as const;
export type MomentRepas = (typeof MOMENTS_REPAS)[number];

/** Micronutriments écrits par le trigger dans `journal_entrees.micros` (clé → unité), dans l'ordre d'affichage. */
export const MICROS = {
  fer_mg: 'mg',
  calcium_mg: 'mg',
  magnesium_mg: 'mg',
  potassium_mg: 'mg',
  zinc_mg: 'mg',
  sodium_mg: 'mg',
  vitamine_c_mg: 'mg',
  'vitamine_d_µg': 'µg',
  'vitamine_b12_µg': 'µg',
  vitamine_b6_mg: 'mg',
  'vitamine_a_µg': 'µg',
  'folates_µg': 'µg',
  omega3_ala_mg: 'mg',
  omega3_epa_dha_mg: 'mg',
} as const;
export type CleMicro = keyof typeof MICROS;

/** Ligne de `aliments` (valeurs pour 100 g ; PostgREST renvoie les `numeric` en texte). */
export type Aliment = {
  id: string;
  slug: string;
  nom: string;
  categorie: string | null;
  calories_100g: number | string | null;
  proteines_100g: number | string | null;
  glucides_100g: number | string | null;
  lipides_100g: number | string | null;
  portion_standard_g: number | null;
  actif: boolean | null;
  remplace_par: string | null;
};

export type Nutriments = {
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres: number;
  sucres: number;
  micros: Partial<Record<CleMicro, number>>;
};

/** Ligne de `journal_entrees`, nom repris de l'aliment ou de la saisie libre. */
export type EntreeJournal = Nutriments & {
  id: string;
  date_entree: string;
  moment_journee: MomentRepas;
  aliment_id: string | null;
  nom: string;
  quantite_g: number;
};

/** Ce que l'app envoie : l'aliment et la quantité, ou, en saisie libre, le nom et les valeurs saisies. */
export type NouvelleEntree = {
  date_entree: string;
  moment_journee: MomentRepas;
  quantite_g: number;
  heure: string;
  source_saisie: 'manuel';
} & (
  | { aliment_id: string }
  | { aliment_id: null; nom_libre: string; calories?: number; proteines: number; glucides: number; lipides: number }
);

/** Totaux du jour (`journal_nutrition`), tenus à jour par la base. */
export type TotauxJour = {
  calories: number;
  proteines: number;
  glucides: number;
  lipides: number;
  fibres: number;
  sucres: number;
  sodium_mg: number;
};

/** `objectifs_nutritionnels` (ligne active), rédigée par le serveur ; l'app l'affiche telle quelle. */
export type ObjectifsNutritionnels = {
  calories_cibles: number | null;
  proteines_g: number | null;
  glucides_g: number | null;
  lipides_g: number | null;
  fibres_g: number | null;
  hydratation_ml_cible: number | null;
  micronutriments_surveilles: string[] | null;
};

type Intervalle = [number, number];

/** `GET /nutrition/jour` → `nutrition` (tools/nutritionSeance.js du serveur), champs utilisés par l'app. */
export type PlanNutrition = {
  niveau_charge: string;
  glucides_jour_g: Intervalle;
  proteines_jour_g: Intervalle;
  avant: { quand: string; glucides_g: Intervalle; idee: string; collation?: { quand: string; glucides_g: Intervalle; idee: string } } | null;
  pendant: { glucides_g_h: number | string | Intervalle; eau_ml_h: Intervalle; sodium_mg_h: Intervalle | null } | null;
  apres: { quand: string; glucides_g: Intervalle; proteines_g: Intervalle; note: string | null } | null;
  hydratation: { avant_ml: Intervalle; pendant_ml_h: Intervalle; apres?: string } | null;
  alertes: string[];
  consignes?: string[];
};

/** Journal alimentaire (table `repas_journal`, migration repas_journal_etape_14) et base `aliments`. */

export const MOMENTS_REPAS = ['petit_dejeuner', 'dejeuner', 'collation', 'diner', 'avant_seance', 'pendant_seance', 'apres_seance'] as const;
export type MomentRepas = (typeof MOMENTS_REPAS)[number];

/** Micronutriments suivis : clé dans `repas_journal.micros` → colonne de `aliments` (pour 100 g) et unité. */
export const MICROS = {
  fer_mg: { colonne: 'fer_mg', unite: 'mg' },
  calcium_mg: { colonne: 'calcium_mg', unite: 'mg' },
  magnesium_mg: { colonne: 'magnesium_mg', unite: 'mg' },
  potassium_mg: { colonne: 'potassium_mg', unite: 'mg' },
  zinc_mg: { colonne: 'zinc_mg', unite: 'mg' },
  sodium_mg: { colonne: 'sodium_100g', unite: 'mg' },
  vitamine_c_mg: { colonne: 'vitamine_c_mg', unite: 'mg' },
  vitamine_d_ug: { colonne: 'vitamine_d_µg', unite: 'µg' },
  vitamine_b12_ug: { colonne: 'vitamine_b12_µg', unite: 'µg' },
  omega3_mg: { colonne: 'omega3_mg', unite: 'mg' },
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
  dont_sucres_100g: number | string | null;
  lipides_100g: number | string | null;
  fibres_100g: number | string | null;
  portion_standard_g: number | null;
} & Record<string, unknown>;

export type Nutriments = {
  calories: number;
  proteines_g: number;
  glucides_g: number;
  lipides_g: number;
  fibres_g: number;
  sucres_g: number;
  micros: Partial<Record<CleMicro, number>>;
};

export type LigneRepas = Nutriments & {
  id: string;
  date_repas: string;
  moment: MomentRepas;
  heure: string;
  aliment_id: string | null;
  nom: string;
  quantite_g: number;
  source: 'aliment' | 'saisie_libre';
};

export type NouvelleLigne = Omit<LigneRepas, 'id' | 'heure'>;

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

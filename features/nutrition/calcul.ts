import { MICROS, type Aliment, type CleMicro, type LigneRepas, type MomentRepas, type Nutriments } from './types';

const nombre = (v: unknown) => {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : 0;
};
const arrondi = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

/**
 * Nutriments d'une portion : valeurs de la base `aliments` (pour 100 g) × quantité. Simple règle de trois, aucune
 * recommandation : les objectifs du jour viennent du serveur. Le sodium est stocké en g/100 g dans `aliments`.
 */
export function nutrimentsPour(aliment: Aliment, quantiteG: number): Nutriments {
  const f = quantiteG / 100;
  const micros: Partial<Record<CleMicro, number>> = {};
  (Object.keys(MICROS) as CleMicro[]).forEach((cle) => {
    const brut = nombre(aliment[MICROS[cle].colonne]);
    const valeur = cle === 'sodium_mg' ? brut * 1000 * f : brut * f;
    if (valeur > 0) micros[cle] = arrondi(valeur);
  });
  return {
    calories: Math.round(nombre(aliment.calories_100g) * f),
    proteines_g: arrondi(nombre(aliment.proteines_100g) * f),
    glucides_g: arrondi(nombre(aliment.glucides_100g) * f),
    lipides_g: arrondi(nombre(aliment.lipides_100g) * f),
    fibres_g: arrondi(nombre(aliment.fibres_100g) * f),
    sucres_g: arrondi(nombre(aliment.dont_sucres_100g) * f),
    micros,
  };
}

export const NUTRIMENTS_VIDES: Nutriments = { calories: 0, proteines_g: 0, glucides_g: 0, lipides_g: 0, fibres_g: 0, sucres_g: 0, micros: {} };

/** Totaux d'une liste de lignes du journal. */
export function totaux(lignes: Pick<LigneRepas, keyof Nutriments>[]): Nutriments {
  return lignes.reduce<Nutriments>((t, l) => {
    const micros = { ...t.micros };
    (Object.keys(l.micros ?? {}) as CleMicro[]).forEach((cle) => {
      micros[cle] = arrondi((micros[cle] ?? 0) + nombre(l.micros[cle]));
    });
    return {
      calories: t.calories + nombre(l.calories),
      proteines_g: arrondi(t.proteines_g + nombre(l.proteines_g)),
      glucides_g: arrondi(t.glucides_g + nombre(l.glucides_g)),
      lipides_g: arrondi(t.lipides_g + nombre(l.lipides_g)),
      fibres_g: arrondi(t.fibres_g + nombre(l.fibres_g)),
      sucres_g: arrondi(t.sucres_g + nombre(l.sucres_g)),
      micros,
    };
  }, NUTRIMENTS_VIDES);
}

/** Part de chaque macronutriment dans les calories (4 kcal/g protéines et glucides, 9 kcal/g lipides). */
export function equilibre(t: Nutriments): { proteines: number; glucides: number; lipides: number } | null {
  const p = t.proteines_g * 4;
  const g = t.glucides_g * 4;
  const l = t.lipides_g * 9;
  const total = p + g + l;
  if (total <= 0) return null;
  return { proteines: Math.round((p / total) * 100), glucides: Math.round((g / total) * 100), lipides: Math.round((l / total) * 100) };
}

/** Moment proposé par défaut selon l'heure (modifiable). */
export function momentParDefaut(maintenant = new Date()): MomentRepas {
  const h = maintenant.getHours();
  if (h < 10) return 'petit_dejeuner';
  if (h < 15) return 'dejeuner';
  if (h < 18) return 'collation';
  return 'diner';
}

import type { CleMicro, EntreeJournal, MomentRepas, Nutriments } from './types';

const nombre = (v: unknown) => {
  const n = typeof v === 'string' ? Number(v) : typeof v === 'number' ? v : NaN;
  return Number.isFinite(n) ? n : 0;
};
const arrondi = (v: number, d = 1) => Math.round(v * 10 ** d) / 10 ** d;

export const NUTRIMENTS_VIDES: Nutriments = { calories: 0, proteines: 0, glucides: 0, lipides: 0, fibres: 0, sucres: 0, micros: {} };

/**
 * Somme des entrées d'un moment (répartition dans la journée) et des micronutriments du jour, absents de
 * `journal_nutrition`. Simple addition des valeurs calculées par la base.
 */
export function totaux(entrees: Pick<EntreeJournal, keyof Nutriments>[]): Nutriments {
  return entrees.reduce<Nutriments>((t, e) => {
    const micros = { ...t.micros };
    (Object.keys(e.micros ?? {}) as CleMicro[]).forEach((cle) => {
      micros[cle] = arrondi((micros[cle] ?? 0) + nombre(e.micros[cle]), 2);
    });
    return {
      calories: arrondi(t.calories + nombre(e.calories)),
      proteines: arrondi(t.proteines + nombre(e.proteines)),
      glucides: arrondi(t.glucides + nombre(e.glucides)),
      lipides: arrondi(t.lipides + nombre(e.lipides)),
      fibres: arrondi(t.fibres + nombre(e.fibres)),
      sucres: arrondi(t.sucres + nombre(e.sucres)),
      micros,
    };
  }, NUTRIMENTS_VIDES);
}

/** Part de chaque macronutriment dans les apports (4 kcal/g protéines et glucides, 9 kcal/g lipides). */
export function equilibre(t: { proteines: number; glucides: number; lipides: number }): { proteines: number; glucides: number; lipides: number } | null {
  const p = t.proteines * 4;
  const g = t.glucides * 4;
  const l = t.lipides * 9;
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

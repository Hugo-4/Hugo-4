import { formatNombre } from '@/lib/format';

/** Grammes ou milligrammes : une décimale sous 10 (« 2,5 »), entier au-delà. */
export function formatQuantite(valeur: number): string {
  return formatNombre(valeur, valeur > 0 && valeur < 10 && valeur % 1 !== 0 ? 1 : 0);
}

/** Cible du serveur : une valeur ou un intervalle (« 140–180 »). */
export function formatCible(cible: number | [number, number]): string {
  return Array.isArray(cible) ? `${formatNombre(cible[0])}–${formatNombre(cible[1])}` : formatNombre(cible);
}

/** Position dans la cible (0 à 1) pour la jauge : par rapport au haut de l'intervalle. */
export function progressionVers(consomme: number, cible: number | [number, number]): number {
  const haut = Array.isArray(cible) ? cible[1] : cible;
  return haut > 0 ? consomme / haut : 0;
}

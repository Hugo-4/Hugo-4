import { dateLocale, formatNombre } from '@/lib/format';
import i18n from '@/lib/i18n';

/** Nombre de décimales utiles (au plus 2) : 112,5 → 1 ; 4,62 → 2 ; 46 → 0. */
function decimalesDe(valeur: number): number {
  for (let d = 0; d < 2; d++) {
    if (Math.abs(Math.round(valeur * 10 ** d) - valeur * 10 ** d) < 1e-9) return d;
  }
  return 2;
}

/** Valeur avec son unité selon la langue : « 112,5 kg », « 1 840 UA », « 17.5 km/h ». */
export function formatValeur(valeur: number, unite?: string | null): string {
  const nombre = formatNombre(valeur, decimalesDe(valeur));
  return unite ? i18n.t('progres.valeurUnite', { valeur: nombre, unite }) : nombre;
}

/** Date courte : « 21 oct. » (avec l'année si ce n'est pas l'année en cours : « 21 oct. 2025 »). */
export function formatDateJour(iso: string): string {
  const date = dateLocale(iso);
  const autreAnnee = date.getFullYear() !== new Date().getFullYear();
  return date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'short', ...(autreAnnee ? { year: 'numeric' } : {}) });
}

/** Libellé court d'une semaine sous une barre : « 03/08 » / « 8/3 ». */
export function formatSemaineCourte(iso: string): string {
  return dateLocale(iso).toLocaleDateString(i18n.language, { day: 'numeric', month: 'numeric' });
}

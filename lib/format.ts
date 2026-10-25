import i18n from './i18n';

/** Nombre formaté selon la langue de l'app (1 840 en français, 1,840 en anglais). */
export function formatNombre(valeur: number, decimales = 0): string {
  return new Intl.NumberFormat(i18n.language, {
    minimumFractionDigits: decimales,
    maximumFractionDigits: decimales,
  }).format(valeur);
}

/** Nombre avec son signe (+4, −3). */
export function formatEcart(valeur: number): string {
  return new Intl.NumberFormat(i18n.language, { signDisplay: 'exceptZero' }).format(valeur);
}

/** Date de l'en-tête : « mercredi 1 octobre ». */
export function formatDateLongue(date: Date): string {
  const texte = date.toLocaleDateString(i18n.language, { weekday: 'long', day: 'numeric', month: 'long' });
  return texte.charAt(0).toLocaleUpperCase(i18n.language) + texte.slice(1);
}

/** Initiale du jour pour la semaine : « L », « M »… */
export function formatJourCourt(date: Date): string {
  return date.toLocaleDateString(i18n.language, { weekday: 'narrow' });
}

export function formatJourLong(date: Date): string {
  return date.toLocaleDateString(i18n.language, { weekday: 'long' });
}

/** Durée en heures et minutes : « 7 h 42 » / « 7h 42m ». */
export function formatDuree(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = String(minutes % 60).padStart(2, '0');
  return i18n.t('commun.dureeHeures', { h, m });
}

/** Date ISO « AAAA-MM-JJ » lue en heure locale (et non en UTC). */
export function dateLocale(iso: string): Date {
  const [annee, mois, jour] = iso.split('-').map(Number);
  return new Date(annee, mois - 1, jour);
}

/** Date courte : « 12/03/1998 » / « 3/12/1998 ». */
export function formatDateCourte(iso: string): string {
  return dateLocale(iso).toLocaleDateString(i18n.language, { day: 'numeric', month: 'numeric', year: 'numeric' });
}

/** Horodatage : « 22/10/2026 à 17:41 ». */
export function formatHorodatage(iso: string): string {
  const date = new Date(iso);
  return i18n.t('commun.horodatage', {
    date: date.toLocaleDateString(i18n.language, { day: 'numeric', month: 'numeric', year: 'numeric' }),
    heure: date.toLocaleTimeString(i18n.language, { hour: '2-digit', minute: '2-digit' }),
  });
}

/**
 * Compte à rebours lisible (FRONTEND.md §1) : plus d'un an → « dans 4 ans et 7 mois »,
 * de 60 à 365 jours → « dans 23 semaines », moins de 60 jours → « J-45 ».
 */
export function formatCompteARebours(jours: number, dateEvenement: string, aujourdhui: string): string {
  if (jours < 60) return i18n.t('commun.compteARebours.jours', { count: Math.max(0, jours) });
  if (jours <= 365) return i18n.t('commun.compteARebours.semaines', { count: Math.floor(jours / 7) });
  const debut = dateLocale(aujourdhui);
  const fin = dateLocale(dateEvenement);
  const mois =
    (fin.getFullYear() - debut.getFullYear()) * 12 + fin.getMonth() - debut.getMonth() - (fin.getDate() < debut.getDate() ? 1 : 0);
  const ans = i18n.t('commun.compteARebours.ans', { count: Math.floor(mois / 12) });
  const reste = mois % 12;
  return reste
    ? i18n.t('commun.compteARebours.ansEtMois', { ans, mois: i18n.t('commun.compteARebours.mois', { count: reste }) })
    : i18n.t('commun.compteARebours.dansAns', { ans });
}

/** Date longue d'un événement : « 20 juin 2031 ». */
export function formatDateEvenement(iso: string): string {
  return dateLocale(iso).toLocaleDateString(i18n.language, { day: 'numeric', month: 'long', year: 'numeric' });
}

/** Date courte avec le jour : « lun. 26 oct. ». */
export function formatJourDate(iso: string): string {
  return dateLocale(iso).toLocaleDateString(i18n.language, { weekday: 'short', day: 'numeric', month: 'short' });
}

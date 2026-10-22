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

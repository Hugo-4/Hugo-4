import i18n from '@/lib/i18n';

/**
 * Moment relatif : « à l'instant », « il y a 25 min », « il y a 3 h », « hier », « il y a 3 j », puis la date
 * (« 12 oct. »). Textes traduits plutôt qu'`Intl.RelativeTimeFormat`, absent de certains moteurs JavaScript mobiles.
 */
export function formatIlYa(iso: string, maintenant = Date.now()): string {
  const minutes = Math.max(0, Math.floor((maintenant - new Date(iso).getTime()) / 60_000));
  if (minutes < 1) return i18n.t('notifications.ilYa.instant');
  if (minutes < 60) return i18n.t('notifications.ilYa.minutes', { count: minutes });
  const heures = Math.floor(minutes / 60);
  if (heures < 24) return i18n.t('notifications.ilYa.heures', { count: heures });
  const jours = Math.floor(heures / 24);
  if (jours === 1) return i18n.t('notifications.ilYa.hier');
  if (jours < 7) return i18n.t('notifications.ilYa.jours', { count: jours });
  return new Date(iso).toLocaleDateString(i18n.language, { day: 'numeric', month: 'short' });
}

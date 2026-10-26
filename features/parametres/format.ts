import i18n from '@/lib/i18n';

/** Heure « HH:MM » dans le format de la langue de l'app (« 21:30 » / « 9:30 PM »). */
export function formatHeure(hhmm: string): string {
  const [h, m] = hhmm.split(':').map(Number);
  if (!Number.isInteger(h) || !Number.isInteger(m)) return hhmm;
  const date = new Date(2000, 0, 1, h, m);
  return date.toLocaleTimeString(i18n.language, { hour: 'numeric', minute: '2-digit' });
}

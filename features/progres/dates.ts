import { dateDuJour } from '@/features/checkin/dateDuJour';
import { dateLocale } from '@/lib/format';

/** Date ISO « AAAA-MM-JJ » décalée de `jours` (calcul en heure locale, sans décalage d'heure d'été). */
export function ajouterJours(iso: string, jours: number): string {
  const date = dateLocale(iso);
  date.setDate(date.getDate() + jours);
  return dateDuJour(date);
}

/** Lundi de la semaine qui contient la date. */
export function lundiDe(iso: string): string {
  const jour = dateLocale(iso).getDay();
  return ajouterJours(iso, jour === 0 ? -6 : 1 - jour);
}

/** Date du jour décalée (utilisé par les données fictives). */
export function ilYa(jours: number): string {
  return ajouterJours(dateDuJour(), -jours);
}

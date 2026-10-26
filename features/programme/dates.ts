import type { ValeurDate } from '@/components/DateField';
import { ajouterJours, lundiDe } from '@/features/accueil/semaineProgramme';
import { dateDuJour } from '@/features/checkin/dateDuJour';

export { ajouterJours, dateDuJour };

const MS_JOUR = 86_400_000;

function versUtc(iso: string): number {
  const [a, m, j] = iso.split('-').map(Number);
  return Date.UTC(a, m - 1, j);
}

/** Nombre de jours de `debut` à `fin` (dates AAAA-MM-JJ), négatif si `fin` est avant. */
export function joursEntre(debut: string, fin: string): number {
  return Math.round((versUtc(fin) - versUtc(debut)) / MS_JOUR);
}

/** Mois « AAAA-MM » de la date du jour (heure locale). */
export function moisCourant(): string {
  return dateDuJour().slice(0, 7);
}

/** Mois décalé de `n` (−1 : précédent, +1 : suivant). */
export function moisVoisin(mois: string, n: number): string {
  const [a, m] = mois.split('-').map(Number);
  const date = new Date(Date.UTC(a, m - 1 + n, 1));
  return date.toISOString().slice(0, 7);
}

/**
 * Cases de la grille du mois, semaines commençant le lundi : `null` pour les cases vides
 * avant le 1er et après le dernier jour.
 */
export function grilleMois(mois: string): (string | null)[] {
  const premier = `${mois}-01`;
  const decalage = joursEntre(lundiDe(premier), premier);
  const dernier = ajouterJours(`${moisVoisin(mois, 1)}-01`, -1);
  const nbJours = Number(dernier.slice(8, 10));
  const cases: (string | null)[] = Array.from({ length: decalage }, () => null);
  for (let j = 0; j < nbJours; j++) cases.push(ajouterJours(premier, j));
  while (cases.length % 7 !== 0) cases.push(null);
  return cases;
}

/** Les 7 dates d'une semaine type (lundi → dimanche), pour l'en-tête « L M M J V S D ». */
export function semaineType(): string[] {
  const lundi = lundiDe(dateDuJour());
  return Array.from({ length: 7 }, (_, i) => ajouterJours(lundi, i));
}

/**
 * Jours où une séance prévue le `date` peut être déplacée : de max(aujourd'hui, date − écart) à date + écart,
 * sans le jour prévu lui-même. `dates` est vide si toute la fenêtre est déjà passée.
 */
export function fenetreDeplacement(date: string, ecart: number, aujourdhui = dateDuJour()) {
  const avant = ajouterJours(date, -ecart);
  const debut = avant > aujourdhui ? avant : aujourdhui;
  const fin = ajouterJours(date, ecart);
  const dates: string[] = [];
  for (let jour = debut; jour <= fin; jour = ajouterJours(jour, 1)) if (jour !== date) dates.push(jour);
  return { debut, fin, dates };
}

export const DATE_VIDE: ValeurDate = { jour: '', mois: '', annee: '' };

/** Date ISO AAAA-MM-JJ si la saisie correspond à une vraie date, sinon `null`. */
export function dateIso({ jour, mois, annee }: ValeurDate): string | null {
  const j = Number(jour);
  const m = Number(mois);
  const a = Number(annee);
  if (!jour || !mois || annee.length !== 4 || !Number.isInteger(j) || !Number.isInteger(m)) return null;
  const date = new Date(a, m - 1, j);
  if (date.getFullYear() !== a || date.getMonth() !== m - 1 || date.getDate() !== j) return null;
  return `${annee}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
}

/** Saisie (jour, mois, année) à partir d'une date ISO. */
export function saisieDepuisIso(iso: string): ValeurDate {
  const [annee, mois, jour] = iso.split('-');
  return { jour, mois, annee };
}

/** La saisie est complète (année à 4 chiffres) : on peut la valider. */
export const saisieComplete = (valeur: ValeurDate) => valeur.annee.length === 4 && valeur.jour !== '' && valeur.mois !== '';

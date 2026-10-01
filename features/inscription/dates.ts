import type { DateSaisie } from './types';

/** Date ISO AAAA-MM-JJ si la saisie correspond à une vraie date, sinon `null`. */
export function dateIso({ jour, mois, annee }: DateSaisie): string | null {
  const j = Number(jour);
  const m = Number(mois);
  const a = Number(annee);
  if (!Number.isInteger(j) || !Number.isInteger(m) || !Number.isInteger(a) || annee.length !== 4) return null;
  const date = new Date(a, m - 1, j);
  if (date.getFullYear() !== a || date.getMonth() !== m - 1 || date.getDate() !== j) return null;
  return `${annee}-${String(m).padStart(2, '0')}-${String(j).padStart(2, '0')}`;
}

export function age(naissanceIso: string, aujourdhui = new Date()): number {
  const [a, m, j] = naissanceIso.split('-').map(Number);
  let resultat = aujourdhui.getFullYear() - a;
  const anniversairePasse =
    aujourdhui.getMonth() + 1 > m || (aujourdhui.getMonth() + 1 === m && aujourdhui.getDate() >= j);
  if (!anniversairePasse) resultat -= 1;
  return resultat;
}

export function estDansLeFutur(iso: string, aujourdhui = new Date()): boolean {
  const [a, m, j] = iso.split('-').map(Number);
  return new Date(a, m - 1, j) > aujourdhui;
}

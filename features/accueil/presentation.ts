import i18n from '@/lib/i18n';
import { colors } from '@/theme/tokens';

import type { DetailSeance, ExercicePresente, ResumeSeance } from './types';

/** Libellé traduit d'un type de séance (code du serveur), sinon le libellé du serveur. */
export function libelleType(type: ResumeSeance['type']): string {
  const cle = `seance.types.${type.code}`;
  return i18n.exists(cle) ? String(i18n.t(cle as never)) : type.libelle;
}

/** « vide » : rien de prévu ce jour-là (on n'écrit jamais « Repos » à la place, FRONTEND.md §1). */
export type StatutPastille = 'fait' | 'aujourdhui' | 'prevu' | 'manque' | 'vide';

/** Ce qu'il faut pour dessiner un jour : semaine de `GET /accueil` ou semaine à venir de `GET /programme`. */
export type JourPastille = {
  date: string;
  aujourdhui: boolean;
  seances: { type: ResumeSeance['type']; statut: Pick<ResumeSeance['statut'], 'code'> }[];
};

/** État d'un jour de la semaine, à partir du statut des séances renvoyé par le serveur. */
export function statutJour(jour: JourPastille): StatutPastille {
  const faite = jour.seances.length > 0 && jour.seances.every((s) => s.statut.code === 'faite');
  if (faite) return 'fait';
  if (jour.aujourdhui) return 'aujourdhui';
  if (jour.seances.length === 0) return 'vide';
  if (jour.seances.some((s) => s.statut.code === 'manquee')) return 'manque';
  return 'prevu';
}

const BLOCS_TRAVAIL = ['principal', 'accessoire', 'finisher', 'gainage', 'corps'];

/** Exercices de travail de la séance (sans échauffement ni retour au calme), dans l'ordre. */
export function exercicesTravail(detail: DetailSeance | null): ExercicePresente[] {
  return (detail?.exercices?.blocs ?? [])
    .filter((b) => BLOCS_TRAVAIL.includes(b.bloc))
    .flatMap((b) => b.exercices);
}

/** Prescription telle que renvoyée par le serveur : « 4 × 5 · 120 kg · RIR 2 ». */
export function prescription(e: ExercicePresente): string {
  const morceaux: string[] = [];
  if (e.series && e.reps) morceaux.push(`${e.series} × ${e.reps}`);
  else if (e.series) morceaux.push(String(i18n.t('seance.series', { count: e.series })));
  if (e.charge_kg) morceaux.push(String(i18n.t('seance.kg', { valeur: e.charge_kg })));
  if (e.duree_s) morceaux.push(String(i18n.t('seance.secondes', { valeur: e.duree_s })));
  if (e.distance_m) morceaux.push(String(i18n.t('seance.metres', { valeur: e.distance_m })));
  if (e.rir_cible !== null && e.rir_cible !== undefined) morceaux.push(String(i18n.t('seance.rir', { valeur: e.rir_cible })));
  return morceaux.join(' · ');
}

/**
 * Couleur de la forme du jour (score sur 10, FRONTEND.md §4.1) : bonne ≥ 6,7, moyenne de 3,4 à 6,6, basse ≤ 3,3.
 * Toujours accompagnée d'un libellé : la couleur ne porte jamais seule l'information.
 */
export function couleurForme(score: number | null): string {
  if (score === null) return colors.discret;
  if (score >= 6.7) return colors.accent;
  if (score > 3.3) return colors.vigilance;
  return colors.danger;
}

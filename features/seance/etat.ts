import type { DouleurSignalee, ExerciceSeance, SeanceDemarree, SerieRealisee, SerieSuivante } from './types';

/**
 * État local de la séance en cours (ce qui ne vient pas du serveur) : séries saisies,
 * exercice affiché, minuteur de repos, douleurs. Sauvegardé à chaque changement (stockageSeance.ts).
 */
export type StatutExercice = 'a_faire' | 'en_cours' | 'fait' | 'passe' | 'arrete';

export type EtatSeance = {
  programmeSeanceId: string;
  seance: SeanceDemarree;
  /** Heure de début (ms) : sert au chrono et à la durée réelle. */
  debut: number;
  index: number;
  series: Record<string, SerieRealisee[]>;
  /** Séries ajoutées par l'athlète en plus de la prescription. */
  ajoutees: Record<string, number>;
  /** Exercices passés ou arrêtés (douleur), avec la raison. */
  interrompus: Record<string, { statut: 'passe' | 'arrete'; raison: string | null }>;
  suggestions: Record<string, SerieSuivante>;
  repos: { fin: number; duree: number } | null;
  douleurs: DouleurSignalee[];
};

export type Action =
  | { type: 'aller'; index: number }
  | { type: 'valider'; cle: string; serie: SerieRealisee; reposS: number | null; maintenant: number }
  | { type: 'suggestion'; cle: string; suggestion: SerieSuivante }
  | { type: 'repos'; delta: number | 'passer' }
  | { type: 'douleur'; douleur: DouleurSignalee; arreter: boolean }
  | { type: 'passer'; cle: string; raison: string | null }
  | { type: 'ajouterSerie'; cle: string };

export const cleExercice = (e: ExerciceSeance) => e.exercice_seance_id;

/** Tous les exercices dans l'ordre de la séance (échauffement compris). */
export function exercicesDe(seance: SeanceDemarree): ExerciceSeance[] {
  return seance.exercices.blocs.flatMap((b) => b.exercices);
}

export function seriesPrevues(etat: EtatSeance, e: ExerciceSeance): number {
  return Math.max(1, e.series ?? 1) + (etat.ajoutees[cleExercice(e)] ?? 0);
}

export function statutExercice(etat: EtatSeance, e: ExerciceSeance, index: number): StatutExercice {
  const cle = cleExercice(e);
  if (etat.interrompus[cle]) return etat.interrompus[cle].statut;
  const faites = etat.series[cle]?.length ?? 0;
  if (faites >= seriesPrevues(etat, e)) return 'fait';
  if (faites > 0 || index === etat.index) return 'en_cours';
  return 'a_faire';
}

const termine = (s: StatutExercice) => s === 'fait' || s === 'passe' || s === 'arrete';

/** Prochain exercice qui reste à faire après `depuis` (ou le premier restant), sinon `depuis`. */
function prochainIndex(etat: EtatSeance, depuis: number): number {
  const liste = exercicesDe(etat.seance);
  const ordre = [...liste.keys()].slice(depuis + 1).concat([...liste.keys()].slice(0, depuis + 1));
  return ordre.find((i) => !termine(statutExercice(etat, liste[i], i))) ?? depuis;
}

export function seanceTerminee(etat: EtatSeance): boolean {
  return exercicesDe(etat.seance).every((e, i) => termine(statutExercice(etat, e, i)));
}

export function etatInitial(programmeSeanceId: string, seance: SeanceDemarree, maintenant: number): EtatSeance {
  return {
    programmeSeanceId, seance, debut: maintenant, index: 0,
    series: {}, ajoutees: {}, interrompus: {}, suggestions: {}, repos: null, douleurs: [],
  };
}

export function reducteur(etat: EtatSeance, action: Action): EtatSeance {
  switch (action.type) {
    case 'aller':
      return { ...etat, index: action.index };
    case 'valider': {
      const series = { ...etat.series, [action.cle]: [...(etat.series[action.cle] ?? []), action.serie] };
      const suivant = { ...etat, series };
      const exercice = exercicesDe(etat.seance)[etat.index];
      const fini = exercice && termine(statutExercice(suivant, exercice, etat.index));
      const repos = action.reposS ? { fin: action.maintenant + action.reposS * 1000, duree: action.reposS } : null;
      return { ...suivant, repos, index: fini ? prochainIndex(suivant, etat.index) : etat.index };
    }
    case 'suggestion':
      return { ...etat, suggestions: { ...etat.suggestions, [action.cle]: action.suggestion } };
    case 'repos':
      if (!etat.repos || action.delta === 'passer') return { ...etat, repos: null };
      return { ...etat, repos: { ...etat.repos, fin: etat.repos.fin + action.delta * 1000 } };
    case 'douleur': {
      const avec = { ...etat, douleurs: [...etat.douleurs, action.douleur] };
      const cle = action.douleur.exercice;
      if (!action.arreter || !cle) return avec;
      const arrete = { ...avec, repos: null, interrompus: { ...avec.interrompus, [cle]: { statut: 'arrete' as const, raison: null } } };
      return { ...arrete, index: prochainIndex(arrete, etat.index) };
    }
    case 'passer': {
      const passe = { ...etat, repos: null, interrompus: { ...etat.interrompus, [action.cle]: { statut: 'passe' as const, raison: action.raison } } };
      return { ...passe, index: prochainIndex(passe, etat.index) };
    }
    case 'ajouterSerie':
      return { ...etat, ajoutees: { ...etat.ajoutees, [action.cle]: (etat.ajoutees[action.cle] ?? 0) + 1 } };
  }
}

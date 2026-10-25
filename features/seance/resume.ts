import { exercicesDe, seriesPrevues, type EtatSeance } from './etat';

/** Résumé affiché en fin de séance : uniquement des faits (ce que l'athlète a saisi). */
export type Resume = { volumeKg: number; seriesFaites: number; seriesPrevues: number; dureeMin: number };

export function resumeSeance(etat: EtatSeance, maintenant: number): Resume {
  const exercices = exercicesDe(etat.seance);
  const series = Object.values(etat.series).flat();
  return {
    volumeKg: Math.round(series.reduce((t, s) => t + (s.charge_kg ?? 0) * (s.reps ?? 0), 0)),
    seriesFaites: series.length,
    seriesPrevues: exercices.reduce((t, e) => t + seriesPrevues(etat, e), 0),
    dureeMin: Math.max(1, Math.round((maintenant - etat.debut) / 60_000)),
  };
}

/** Douleurs au format de `POST /seances/:id/feedback` (« epaule 5/10 »). */
export function douleursPourServeur(etat: EtatSeance): string[] {
  return etat.douleurs.map((d) => `${d.zone} ${d.intensite}/10`);
}

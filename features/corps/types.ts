/** `GET /poids` et `POST /poids` (fonction `tendance_poids` + 60 derniers jours de `mesures_poids`). */
export type TendancePoids = {
  moyenne_7j: number | null;
  derniere: { date: string; poids_kg: number } | null;
  pente_kg_semaine: number | null;
  poids_profil: number | null;
  nb_mesures_28j: number;
};

export type MesurePoids = { date_mesure: string; poids_kg: number; moment: MomentPesee | null };

export type HistoriquePoids = { tendance: TendancePoids; mesures: MesurePoids[] };

/** Moments acceptés par `POST /poids`. */
export const MOMENTS_PESEE = ['matin_a_jeun', 'avant_seance', 'apres_seance', 'autre'] as const;
export type MomentPesee = (typeof MOMENTS_PESEE)[number];

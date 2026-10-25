import type { ExerciceSeance, SeanceDemarree } from './types';

/**
 * Séance fictive au format de `POST /programme/seances/:id/demarrer`, en attendant la route serveur.
 * Les identifiants commencent par « fictif- » : rien n'est envoyé au serveur pour eux.
 */
export const PREFIXE_FICTIF = 'fictif-';

function exercice(
  ordre: number,
  bloc: string,
  slug: string,
  nom: string,
  prescription: Partial<ExerciceSeance>,
): ExerciceSeance {
  return {
    ordre,
    bloc,
    exercice: { slug, nom, muscles: [], consignes: [], type_mesure: null },
    series: null,
    reps: null,
    charge_kg: null,
    rir_cible: null,
    rpe_cible: null,
    repos_s: null,
    tempo: null,
    duree_s: null,
    distance_m: null,
    consigne: null,
    exercice_seance_id: `${PREFIXE_FICTIF}${ordre}`,
    ...prescription,
  };
}

export function seanceFictive(programmeSeanceId: string): SeanceDemarree {
  const exercices: ExerciceSeance[] = [
    exercice(1, 'echauffement', 'mobilite_hanches', 'Mobilité des hanches', { series: 1, duree_s: 60, repos_s: 15 }),
    exercice(2, 'principal', 'muscu_squat_barre', 'Squat barre', {
      series: 4, reps: 5, charge_kg: 80, rpe_cible: 8, rir_cible: 2, repos_s: 150, tempo: '3-1-X-1',
      exercice: { slug: 'muscu_squat_barre', nom: 'Squat barre', muscles: ['quadriceps', 'fessiers'], consignes: ['Pieds largeur d\'épaules', 'Genoux dans l\'axe des pieds', 'Dos neutre, regard devant'], type_mesure: 'charge' },
    }),
    exercice(3, 'principal', 'muscu_souleve_de_terre', 'Soulevé de terre roumain', {
      series: 3, reps: 8, charge_kg: 70, rpe_cible: 7, rir_cible: 3, repos_s: 120,
      exercice: { slug: 'muscu_souleve_de_terre', nom: 'Soulevé de terre roumain', muscles: ['ischio_jambiers', 'fessiers'], consignes: ['Hanches vers l\'arrière', 'Barre proche des jambes'], type_mesure: 'charge' },
    }),
    exercice(4, 'accessoire', 'muscu_fentes_halteres', 'Fentes avec haltères', { series: 3, reps: 10, charge_kg: 16, rpe_cible: 7, repos_s: 90 }),
    exercice(5, 'gainage', 'gainage_planche', 'Planche', { series: 3, duree_s: 45, repos_s: 45 }),
  ];
  const blocs = ['echauffement', 'principal', 'accessoire', 'gainage'].map((bloc) => ({
    bloc,
    libelle: bloc,
    exercices: exercices.filter((e) => e.bloc === bloc),
  }));
  return {
    source: 'finale',
    seance_finale_id: `${PREFIXE_FICTIF}seance-${programmeSeanceId}`,
    nom: 'Force · bas du corps',
    lieu: null,
    seance: {
      id: programmeSeanceId,
      date: new Date().toISOString().slice(0, 10),
      creneau: null,
      heure: null,
      sport: { code: 'musculation', nom: 'Musculation', slug: 'musculation' },
      type: { code: 'force', libelle: 'Force' },
      intensite: { niveau: 4, libelle: 'Soutenue', rpe_cible: 8 },
      duree_min: 60,
      titre: 'Force · bas du corps',
      statut: { code: 'en_cours', libelle: 'En cours' },
      badges: [],
      modification: null,
    },
    exercices: { blocs, totaux: { exercices: exercices.length } },
  };
}

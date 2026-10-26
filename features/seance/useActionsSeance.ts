import { useQueryClient } from '@tanstack/react-query';
import { useRef } from 'react';

import { cleExercice, exercicesDe, seriesPrevues } from './etat';
import { ajouter } from './fileEnvoi';
import { viderFile } from './envoi';
import { annulerFinRepos } from './notificationRepos';
import { vibrerValidation } from './retours';
import type { Saisie } from './saisie';
import { mesureDe } from './saisie';
import { useSeance } from './SeanceProvider';
import { serieSuivante } from './source';
import { effacerSeanceEnCours } from './stockageSeance';
import type { RetourSeance, SerieRealisee } from './types';

const DELAI_DOUBLE_TOUCHER_MS = 1000;

/** Actions de la séance qui touchent au stockage ou au serveur (le reste passe par `dispatch`). */
export function useActionsSeance() {
  const { etat, dispatch } = useSeance();
  const queryClient = useQueryClient();
  // Double toucher sur « Valider » : une seule série enregistrée par toucher, à moins d'une seconde d'écart.
  const derniereValidation = useRef(0);

  /** Série validée : écrite dans la file AVANT l'envoi, puis envoi et charge conseillée. */
  const validerSerie = async (saisie: Saisie) => {
    const exercice = exercicesDe(etat.seance)[etat.index];
    if (!exercice) return;
    const cle = cleExercice(exercice);
    const precedentes = etat.series[cle] ?? [];
    const maintenant = Date.now();
    if (maintenant - derniereValidation.current < DELAI_DOUBLE_TOUCHER_MS) return;
    derniereValidation.current = maintenant;
    const serie: SerieRealisee = {
      serie: precedentes.length + 1,
      reps: mesureDe(exercice) === 'reps' ? saisie.reps : null,
      charge_kg: saisie.charge,
      rpe: saisie.rpe,
      ...(mesureDe(exercice) === 'duree' ? { duree_sec: saisie.duree } : {}),
      complete: true,
    };
    vibrerValidation();
    dispatch({ type: 'valider', cle, serie, reposS: exercice.repos_s ?? null, maintenant });
    await ajouter({
      methode: 'PUT',
      chemin: `/exercices-seance/${cle}/series`,
      corps: { series_realisees: [...precedentes, serie] },
      cle: `series:${cle}`,
    });
    viderFile().catch(() => undefined);

    const restantes = seriesPrevues(etat, exercice) - serie.serie;
    if (restantes > 0 && serie.charge_kg && serie.reps && saisie.rpe !== null) {
      const suggestion = await serieSuivante({
        charge_kg: serie.charge_kg,
        reps: serie.reps,
        rpe: saisie.rpe,
        reps_cible: exercice.reps,
        rpe_cible: exercice.rpe_cible,
      });
      if (suggestion) dispatch({ type: 'suggestion', cle, suggestion });
    }
  };

  const fermer = async () => {
    await annulerFinRepos();
    await effacerSeanceEnCours();
    queryClient.invalidateQueries({ queryKey: ['seanceEnCours'] });
    queryClient.invalidateQueries({ queryKey: ['accueil'] });
    queryClient.invalidateQueries({ queryKey: ['calendrier'] });
    queryClient.invalidateQueries({ queryKey: ['programme'] });
    queryClient.invalidateQueries({ queryKey: ['progres'] });
  };

  /** Fin de séance : le retour part par la file (hors ligne compris), puis la séance est close. */
  const terminer = async (retour: RetourSeance) => {
    await ajouter({
      methode: 'POST',
      chemin: `/seances/${etat.seance.seance_finale_id}/feedback`,
      corps: retour,
      cle: `feedback:${etat.seance.seance_finale_id}`,
    });
    viderFile().catch(() => undefined);
    await fermer();
  };

  return { validerSerie, terminer, abandonner: fermer };
}

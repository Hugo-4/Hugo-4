import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { cleExercice, exercicesDe, seriesPrevues } from './etat';
import { annulerFinRepos, programmerFinRepos } from './notificationRepos';
import { useSeance } from './SeanceProvider';

/**
 * Suit l'heure de fin du repos : programmée à la validation de la série, reprogrammée sur −15 s / +15 s,
 * annulée quand l'athlète passe le repos, quand il se termine ou quand l'exercice est arrêté.
 */
export function useNotificationRepos() {
  const { t } = useTranslation();
  const { etat } = useSeance();
  const fin = etat.repos?.fin ?? null;

  useEffect(() => {
    if (fin === null) {
      annulerFinRepos();
      return;
    }
    const exercice = exercicesDe(etat.seance)[etat.index];
    const faites = exercice ? (etat.series[cleExercice(exercice)]?.length ?? 0) : 0;
    const texte = exercice
      ? t('enSeance.notification.suivante', {
          nom: exercice.exercice.nom,
          numero: Math.min(faites + 1, seriesPrevues(etat, exercice)),
          total: seriesPrevues(etat, exercice),
        })
      : t('enSeance.notification.reprendre');
    programmerFinRepos(fin, texte);
    // Seule l'heure de fin compte : le texte est pris au moment où le repos démarre.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fin]);
}

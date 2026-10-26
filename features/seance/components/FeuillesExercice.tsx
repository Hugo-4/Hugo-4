import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ouvrirCoachEnSeance } from '@/features/coach/ouvrirCoach';

import { cleExercice } from '../etat';
import { useSeance } from '../SeanceProvider';
import type { ExerciceSeance } from '../types';
import { FeuilleDouleur, SEUIL_ARRET_DOULEUR } from './FeuilleDouleur';
import { FicheExercice } from './FicheExercice';
import { MenuExercice } from './MenuExercice';

type Props = {
  exercice: ExerciceSeance | null;
  feuille: 'fiche' | 'menu' | 'douleur' | null;
  onFermer: () => void;
};

/** Fiche technique, menu « ⋯ » et douleur de l'exercice affiché. */
export function FeuillesExercice({ exercice, feuille, onFermer }: Props) {
  const { t } = useTranslation();
  const { etat, dispatch } = useSeance();
  const cle = exercice ? cleExercice(exercice) : null;
  // Le remplacement est proposé par le coach, avec l'exercice en contexte ; la séance reste sauvegardée.
  const remplacer = () => {
    onFermer();
    if (exercice) {
      ouvrirCoachEnSeance({ type: 'exercice', programmeSeanceId: etat.programmeSeanceId, exerciceSlug: exercice.exercice.slug, nom: exercice.exercice.nom });
    } else {
      ouvrirCoachEnSeance();
    }
  };

  return (
    <>
      <FicheExercice exercice={feuille === 'fiche' ? exercice : null} onFermer={onFermer} />
      <MenuExercice
        visible={feuille === 'menu'}
        onFermer={onFermer}
        onRemplacer={remplacer}
        onAjouterSerie={() => {
          if (cle) dispatch({ type: 'ajouterSerie', cle });
          onFermer();
        }}
        onPasser={(raison) => {
          if (cle) dispatch({ type: 'passer', cle, raison });
          onFermer();
        }}
      />
      <FeuilleDouleur
        visible={feuille === 'douleur'}
        onFermer={onFermer}
        onArreterSansDetail={() => cle && dispatch({ type: 'passer', cle, raison: 'douleur' })}
        onSignaler={(zone, intensite) => {
          const arreter = intensite > SEUIL_ARRET_DOULEUR;
          dispatch({ type: 'douleur', douleur: { zone, intensite, exercice: cle }, arreter });
          if (arreter) {
            Alert.alert(t('enSeance.douleur.arreteTitre'), t('enSeance.douleur.arreteTexte'), [
              { text: t('enSeance.menu.remplacer'), onPress: remplacer },
              { text: t('enSeance.douleur.continuer'), style: 'cancel' },
            ]);
          }
        }}
      />
    </>
  );
}

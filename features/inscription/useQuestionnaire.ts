import { router } from 'expo-router';

import { AGE_MIN_SANS_PARENT } from './constantes';
import { age, dateIso } from './dates';
import { etapeValide } from './etapes';
import { useInscription } from './InscriptionProvider';
import { useEnregistrerInscription } from './useEnregistrerInscription';

/** Navigation dans les questions : suivant, retour, contrôle d'âge et enregistrement final. */
export function useQuestionnaire() {
  const { etapes, index, setIndex, reponses } = useInscription();
  const enregistrement = useEnregistrerInscription();
  const etape = etapes[Math.min(index, etapes.length - 1)];
  const derniere = index >= etapes.length - 1;

  const suivant = () => {
    if (etape === 'identite') {
      const naissance = dateIso(reponses.naissance);
      if (naissance && age(naissance) < AGE_MIN_SANS_PARENT) {
        router.push('/inscription/parent');
        return;
      }
    }
    if (!derniere) {
      setIndex(index + 1);
      return;
    }
    enregistrement.mutate(undefined, { onSuccess: () => router.replace('/inscription/generation') });
  };

  const retour = () => {
    if (index > 0) setIndex(index - 1);
    else router.back();
  };

  return {
    etape,
    numero: index + 1,
    total: etapes.length,
    derniere,
    valide: etapeValide(etape, reponses),
    suivant,
    retour,
    enregistrement,
  };
}

import { useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import { useSession } from '@/features/auth/AuthProvider';

import { PARTIES } from './enregistrement';
import { useInscription } from './InscriptionProvider';

/** Enregistre toutes les réponses ; en cas d'échec, un nouvel essai reprend là où ça s'est arrêté. */
export function useEnregistrerInscription() {
  const { t, i18n } = useTranslation();
  const { session } = useSession();
  const { parcours, consentementSante, reponses, enregistrees } = useInscription();

  return useMutation({
    mutationFn: async () => {
      if (!session) throw new Error('Session absente');
      const contexte = {
        userId: session.user.id,
        parcours,
        consentementSante,
        reponses,
        langue: i18n.language,
        nomLieu: reponses.lieu ? t(`inscription.lieu.${reponses.lieu}`) : '',
      };
      for (const partie of PARTIES) {
        if (enregistrees.has(partie.nom)) continue;
        await partie.executer(contexte);
        enregistrees.add(partie.nom);
      }
    },
  });
}

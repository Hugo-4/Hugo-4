import { useQueryClient } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';

import { useSession } from '@/features/auth/AuthProvider';
import type { StatutCompte } from '@/features/auth/useStatutCompte';

import { useGenererProgramme } from './useGenererProgramme';

/**
 * Lance `POST /programme/generer` une seule fois à l'ouverture de l'écran.
 * Une fois le programme créé, la base passe `onboarding_complete` à true : on relit ce statut,
 * et la navigation part d'elle-même sur Aujourd'hui.
 * En cas d'échec réseau, on vérifie d'abord ce statut (le programme a pu être créé) avant de proposer de relancer.
 */
export function useGeneration() {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const generation = useGenererProgramme();
  const [echec, setEchec] = useState<unknown>(null);
  const lance = useRef(false);
  const cle = ['statutCompte', session?.user.id];

  const relireStatut = async () => {
    await queryClient.refetchQueries({ queryKey: cle });
    return queryClient.getQueryData<StatutCompte>(cle)?.onboardingComplete === true;
  };

  const demarrer = () => {
    setEchec(null);
    generation.mutate(undefined, {
      onSuccess: async () => {
        if (!(await relireStatut())) setEchec(new Error('Statut non mis à jour'));
      },
      onError: async (erreur) => {
        if (!(await relireStatut())) setEchec(erreur);
      },
    });
  };

  useEffect(() => {
    if (lance.current) return;
    lance.current = true;
    demarrer();
    // Lancement unique à l'ouverture de l'écran.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { enCours: echec === null, echec, reessayer: demarrer };
}

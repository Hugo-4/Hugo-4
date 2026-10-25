import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { sizes } from '@/theme/tokens';

import { useSouvenirsVisibles } from '../useMemoire';
import { FormulaireSouvenir } from './FormulaireSouvenir';

/**
 * Écran d'un élément retenu (`/compte/memoire?id=…`). Un souvenir de santé n'est jamais ouvert sans
 * consentement. Après un effacement, l'élément reste affiché le temps du retour à la liste.
 */
export function EditionSouvenir({ id }: { id: string }) {
  const { t } = useTranslation();
  const { memoire, visibles } = useSouvenirsVisibles();
  const actuel = visibles.find((s) => s.id === id);
  const [connu] = useState(actuel);
  const souvenir = actuel ?? (memoire.data?.some((s) => s.id === id) ? undefined : connu);

  if (souvenir) return <FormulaireSouvenir souvenir={souvenir} />;
  return (
    <EcranEdition titre={t('parametres.memoire.modifier')}>
      <EtatsEcran
        chargement={memoire.isPending}
        erreur={memoire.error}
        aDesDonnees={memoire.data !== undefined}
        onReessayer={memoire.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme * 2} />}>
        <EmptyState titre={t('parametres.memoire.introuvable')} />
      </EtatsEcran>
    </EcranEdition>
  );
}

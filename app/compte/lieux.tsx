import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { FormulaireLieu } from '@/features/parametres/components/FormulaireLieu';
import { ListeLieux } from '@/features/parametres/components/ListeLieux';
import { useListeLieux } from '@/features/parametres/useLieux';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { sizes } from '@/theme/tokens';

/**
 * Profil : mes lieux. Sans paramètre : la liste ; `?id=nouveau` : ajout ; `?id=<uuid>` : modification
 * (un écran à part, pour que le clavier et le retour fonctionnent comme partout).
 */
export default function LieuxScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const lieux = useListeLieux();

  if (!id) return <ListeLieux />;
  if (id === 'nouveau') return <FormulaireLieu initial={null} />;
  const lieu = lieux.data?.find((l) => l.id === id);
  if (lieu) return <FormulaireLieu initial={lieu} />;
  return (
    <EcranEdition titre={t('parametres.lieux.modifier')}>
      <EtatsEcran
        chargement={lieux.isPending}
        erreur={lieux.error}
        aDesDonnees={lieux.data !== undefined}
        onReessayer={lieux.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme * 2} />}>
        <EmptyState titre={t('parametres.lieux.introuvable')} />
      </EtatsEcran>
    </EcranEdition>
  );
}

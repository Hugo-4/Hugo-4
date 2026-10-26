import { router } from 'expo-router';
import { CreditCard, SlidersHorizontal, Watch } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { LigneListe } from '@/components/LigneListe';
import { colors, sizes } from '@/theme/tokens';

import type { Offre } from '../types';
import { GroupeRubriques } from './GroupeRubriques';

const icone = { color: colors.texte2, size: sizes.icone };

/** Abonnement et crédits · Appareils connectés · Préférences. */
export function RubriquesReglages({ offre }: { offre: Offre | undefined }) {
  const { t } = useTranslation();
  return (
    <GroupeRubriques titre={t('parametres.profil.groupes.reglages')}>
      <LigneListe
        icon={<CreditCard {...icone} />}
        titre={t('parametres.profil.rubriques.abonnement')}
        valeur={offre ? t(`parametres.abonnement.offres.${offre}`) : undefined}
        onPress={() => router.push('/compte/abonnement')}
      />
      <LigneListe
        icon={<Watch {...icone} />}
        titre={t('parametres.profil.rubriques.appareils')}
        sousTitre={t('parametres.profil.sousTitres.appareils')}
        valeur={t('parametres.bientot')}
        onPress={() => router.push('/compte/appareils')}
      />
      <LigneListe
        icon={<SlidersHorizontal {...icone} />}
        titre={t('parametres.profil.rubriques.preferences')}
        sousTitre={t('parametres.profil.sousTitres.preferences')}
        onPress={() => router.push('/compte/preferences')}
      />
    </GroupeRubriques>
  );
}

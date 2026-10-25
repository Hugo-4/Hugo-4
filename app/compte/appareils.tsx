import { Watch } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { LigneListe } from '@/components/LigneListe';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { colors, sizes } from '@/theme/tokens';

const APPAREILS = ['apple_sante', 'health_connect', 'strava', 'garmin', 'coros', 'kiprun'] as const;

/** Profil : appareils connectés, tous « bientôt disponibles » (aucune intégration à cette étape). */
export default function AppareilsScreen() {
  const { t } = useTranslation();
  return (
    <EcranEdition titre={t('parametres.appareils.titre')}>
      <AppText variant="secondaire">{t('parametres.appareils.texte')}</AppText>
      {APPAREILS.map((appareil) => {
        const nom = t(`parametres.appareils.liste.${appareil}`);
        return (
          <LigneListe
            key={appareil}
            icon={<Watch color={colors.texte2} size={sizes.icone} />}
            titre={nom}
            valeur={t('parametres.bientot')}
            accessibilityHint={t('parametres.appareils.a11yBientot', { nom })}
          />
        );
      })}
    </EcranEdition>
  );
}

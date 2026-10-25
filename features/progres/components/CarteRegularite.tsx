import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { formatNombre } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import type { EtatSection } from '../etats';
import { PROGRES_FICTIF } from '../source';
import type { Regularite } from '../types';
import { CarteSection } from './CarteSection';
import { TexteSerie } from './TexteSerie';

type Props = {
  regularite: Regularite | undefined;
  etat: EtatSection;
  onReessayer: () => void;
  onPress: () => void;
};

/** Semaines réussies et série en cours, sans jamais culpabiliser. */
export function CarteRegularite({ regularite, etat, onReessayer, onPress }: Props) {
  const { t } = useTranslation();
  const vide = !regularite || regularite.semaines_comptees === 0;

  return (
    <CarteSection
      titre={t('progres.regularite.titre')}
      etat={etat}
      onReessayer={onReessayer}
      onPress={vide ? undefined : onPress}
      exemple={PROGRES_FICTIF}>
      {regularite && !vide ? (
        <>
          <View style={styles.chiffre}>
            <AppText variant="chiffreXL" maxFontSizeMultiplier={1.3}>
              {t('progres.regularite.reussies', {
                reussies: formatNombre(regularite.semaines_reussies),
                total: formatNombre(regularite.semaines_comptees),
              })}
            </AppText>
            <AppText variant="secondaire" style={styles.libelle}>
              {t('progres.regularite.reussiesLibelle')}
            </AppText>
          </View>
          <TexteSerie regularite={regularite} />
        </>
      ) : (
        <AppText variant="secondaire">{t('progres.regularite.videTexte')}</AppText>
      )}
    </CarteSection>
  );
}

const styles = StyleSheet.create({
  chiffre: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.s, flexWrap: 'wrap' },
  libelle: { paddingBottom: spacing.xs },
});

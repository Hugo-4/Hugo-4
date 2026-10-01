import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { Ring } from '@/components/Ring';
import { formatDuree, formatEcart, formatNombre } from '@/lib/format';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import type { Forme } from '../types';
import { MesureForme } from './MesureForme';

type Props = {
  forme: Forme;
};

export function FormeCard({ forme }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('accueil.forme.titre')}</AppText>
      <View style={styles.ligne}>
        <View accessible accessibilityLabel={t('accueil.forme.a11yScore', { score: forme.score })}>
          <Ring progression={forme.score / 100} taille={sizes.anneauForme} epaisseur={sizes.epaisseurAnneau}>
            <AppText variant="display">{formatNombre(forme.score)}</AppText>
          </Ring>
        </View>
        <View style={styles.mesures}>
          <AppText variant="sousTitre" color={colors.accent}>
            {forme.libelle}
          </AppText>
          <MesureForme libelle={t('accueil.forme.sommeil')} valeur={formatDuree(forme.sommeilMinutes)} />
          <MesureForme
            libelle={t('accueil.forme.hrv')}
            valeur={t('accueil.forme.hrvValeur', { valeur: formatNombre(forme.hrv) })}
            detail={t('accueil.forme.ecartNormale', { ecart: formatEcart(forme.hrvEcart) })}
          />
          <MesureForme libelle={t('accueil.forme.ressenti')} valeur={forme.ressenti} />
        </View>
      </View>
      <View style={styles.coach}>
        <AppText variant="secondaire">{forme.messageCoach}</AppText>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.l },
  mesures: { flex: 1, gap: spacing.xs },
  coach: {
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    padding: spacing.m,
  },
});

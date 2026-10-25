import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Ring } from '@/components/Ring';
import { formatNombre } from '@/lib/format';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { couleurForme } from '../presentation';
import type { CheckinDuJour } from '../types';

type Props = {
  checkin: CheckinDuJour;
  onRefaire: () => void;
};

/** Forme du jour : score et recommandation calculés par la base à partir du check-in. */
export function FormeCard({ checkin, onRefaire }: Props) {
  const { t } = useTranslation();
  const score = checkin.score_forme;
  const couleur = couleurForme(score);
  return (
    <Card>
      <AppText variant="surTitre">{t('accueil.forme.titre')}</AppText>
      <View style={styles.ligne}>
        <View
          accessible
          accessibilityLabel={score !== null ? t('accueil.forme.a11yScore', { score: formatNombre(score, 1) }) : undefined}>
          <Ring progression={(score ?? 0) / 10} taille={sizes.anneauForme} epaisseur={sizes.epaisseurAnneau} couleur={couleur}>
            <AppText variant="display">{score !== null ? formatNombre(score, 1) : '–'}</AppText>
            <AppText variant="libelle">{t('accueil.forme.sur10')}</AppText>
          </Ring>
        </View>
        <View style={styles.mesures}>
          {checkin.recommandation ? (
            <AppText variant="sousTitre" color={couleur}>
              {t(`accueil.forme.recommandations.${checkin.recommandation}`)}
            </AppText>
          ) : null}
          <AppText variant="secondaire">
            {t('accueil.forme.energie', { note: checkin.energie })} · {t('accueil.forme.sommeil', { note: checkin.sommeil_ressenti })}
          </AppText>
          <AppText variant="secondaire">
            {t('accueil.forme.courbatures', { note: checkin.courbatures })} · {t('accueil.forme.stress', { note: checkin.stress_ressenti })}
          </AppText>
        </View>
      </View>
      {checkin.recommandation_raison ? (
        <View style={styles.coach}>
          <AppText variant="secondaire">{checkin.recommandation_raison}</AppText>
        </View>
      ) : null}
      <Button label={t('accueil.forme.refaire')} variant="discret" onPress={onRefaire} />
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.l },
  mesures: { flex: 1, gap: spacing.xs },
  coach: { backgroundColor: colors.carte2, borderRadius: radius.petit, padding: spacing.m },
});

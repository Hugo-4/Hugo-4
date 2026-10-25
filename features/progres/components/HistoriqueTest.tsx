import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { sizes, spacing } from '@/theme/tokens';

import { formatDateJour, formatValeur } from '../format';
import { libelleMethode } from '../presentation';
import type { GroupeTest } from '../regroupement';

/** Tous les résultats d'un test, du plus récent au plus ancien (date, méthode, notes, valeur). */
export function HistoriqueTest({ groupe }: { groupe: GroupeTest }) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('progres.tests.historique')}</AppText>
      {[...groupe.resultats].reverse().map((resultat) => {
        const details = [libelleMethode(resultat.methode), resultat.notes].filter(Boolean).join(' · ');
        return (
          <View key={resultat.id} style={styles.ligne} accessible>
            <View style={styles.textes}>
              <AppText variant="corpsGras">{formatDateJour(resultat.date_test)}</AppText>
              {details ? <AppText variant="libelle">{details}</AppText> : null}
            </View>
            <AppText variant="corpsGras">{formatValeur(resultat.valeur, groupe.type.unite)}</AppText>
          </View>
        );
      })}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.pasAPas },
  textes: { flex: 1, gap: spacing.xxs },
});

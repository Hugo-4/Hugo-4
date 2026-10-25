import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { spacing } from '@/theme/tokens';

import { formatDateJour } from '../format';
import type { SemaineRegularite, StatutSemaine } from '../types';
import { PastilleSemaine } from './PastilleSemaine';

const STATUTS: StatutSemaine[] = ['reussie', 'non_reussie', 'pause', 'en_cours'];

/** Les semaines en pastilles (de la plus ancienne à la semaine en cours), avec leur légende. */
export function GrilleSemaines({ semaines }: { semaines: SemaineRegularite[] }) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('progres.regularite.semaines', { count: semaines.length })}</AppText>
      <View style={styles.grille}>
        {semaines.map((s) => (
          <PastilleSemaine
            key={s.debut}
            statut={s.statut}
            accessibilityLabel={t('progres.regularite.a11ySemaine', {
              date: formatDateJour(s.debut),
              statut: t(`progres.regularite.statut.${s.statut}`),
              seances: t('progres.regularite.seancesFaites', { faites: s.faites, prevues: s.prevues }),
            })}
          />
        ))}
      </View>
      <View style={styles.legende} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {STATUTS.map((statut) => (
          <View key={statut} style={styles.element}>
            <PastilleSemaine statut={statut} petite />
            <AppText variant="libelle">{t(`progres.regularite.statut.${statut}`)}</AppText>
          </View>
        ))}
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  grille: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  legende: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.m },
  element: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});

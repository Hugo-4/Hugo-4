import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { dateLocale, formatJourCourt } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import { grilleMois, semaineType } from '../dates';
import type { JourCalendrier, Legende } from '../types';
import { CaseJour } from './CaseJour';

type Props = {
  mois: string;
  jours: JourCalendrier[];
  legende?: Legende;
  onJour: (jour: JourCalendrier) => void;
};

/**
 * En-tête des jours (« L M M J V S D » selon la langue, masqué pour le lecteur d'écran qui lit la date
 * complète de chaque case) et les semaines du mois, du lundi au dimanche.
 */
export function GrilleMois({ mois, jours, legende, onJour }: Props) {
  const cases = grilleMois(mois);
  const parDate = new Map(jours.map((j) => [j.date, j]));
  const semaines = Array.from({ length: cases.length / 7 }, (_, i) => cases.slice(i * 7, i * 7 + 7));

  return (
    <View style={styles.grille}>
      <View style={styles.semaine} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
        {semaineType().map((date) => (
          <AppText key={date} variant="libelle" style={styles.entete}>
            {formatJourCourt(dateLocale(date)).toLocaleUpperCase()}
          </AppText>
        ))}
      </View>
      {semaines.map((semaine) => (
        <View key={semaine.find(Boolean) ?? 'vide'} style={styles.semaine}>
          {semaine.map((date, i) =>
            date ? (
              <CaseJour key={date} date={date} jour={parDate.get(date)} legende={legende} onPress={onJour} />
            ) : (
              <View key={`vide-${i}`} style={styles.vide} />
            ),
          )}
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  grille: { gap: spacing.xs },
  semaine: { flexDirection: 'row' },
  entete: { flex: 1, textAlign: 'center' },
  vide: { flex: 1 },
});

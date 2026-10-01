import { StyleSheet, View } from 'react-native';

import { colors, radius, sizes } from '@/theme/tokens';

type Props = {
  /** Entre 0 et 1. */
  progression: number;
  accessibilityLabel: string;
};

export function ProgressBar({ progression, accessibilityLabel }: Props) {
  const borne = Math.min(Math.max(progression, 0), 1);
  return (
    <View
      style={styles.piste}
      accessible
      accessibilityRole="progressbar"
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ min: 0, max: 100, now: Math.round(borne * 100) }}>
      <View style={[styles.rempli, { width: `${borne * 100}%` }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  piste: { height: sizes.jauge / 2, borderRadius: radius.rond, backgroundColor: colors.carte2, overflow: 'hidden' },
  rempli: { height: '100%', borderRadius: radius.rond, backgroundColor: colors.accent },
});

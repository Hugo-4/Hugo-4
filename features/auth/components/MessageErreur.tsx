import { TriangleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

export function MessageErreur({ texte }: { texte: string }) {
  return (
    <View style={styles.bandeau} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <TriangleAlert color={colors.alerte} size={sizes.icone} />
      <AppText variant="secondaire" color={colors.texte} style={styles.texte}>
        {texte}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bandeau: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    padding: spacing.m,
    borderRadius: radius.petit,
    borderWidth: sizes.bordure,
    borderColor: colors.alerte,
    backgroundColor: colors.carte,
  },
  texte: { flex: 1 },
});

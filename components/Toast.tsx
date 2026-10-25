import { StyleSheet, View } from 'react-native';

import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { Button } from './Button';

type Props = {
  visible: boolean;
  texte: string;
  /** Action courte (ex. « Annuler » pendant 10 s). */
  action?: { label: string; onPress: () => void };
};

/** Message court en bas de l'écran ; c'est l'écran qui décide quand il disparaît. */
export function Toast({ visible, texte, action }: Props) {
  if (!visible) return null;
  return (
    <View style={styles.toast} accessibilityRole="alert" accessibilityLiveRegion="polite">
      <AppText variant="corps" style={styles.texte}>
        {texte}
      </AppText>
      {action ? <Button label={action.label} variant="discret" onPress={action.onPress} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: 'absolute',
    left: spacing.ecran,
    right: spacing.ecran,
    bottom: spacing.ecran,
    minHeight: sizes.pasAPas,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingHorizontal: spacing.l,
    borderRadius: radius.petit,
    backgroundColor: colors.carte2,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
  },
  texte: { flex: 1 },
});

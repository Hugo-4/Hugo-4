import { HeartPulse } from 'lucide-react-native';
import { Pressable, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

/** « Signaler une douleur » : toujours visible pendant la séance. */
export function BoutonDouleur({ onPress }: { onPress: () => void }) {
  const { t } = useTranslation();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('enSeance.douleur.titre')}
      onPress={onPress}
      style={({ pressed }) => [styles.bouton, pressed && styles.presse]}>
      <HeartPulse color={colors.alerte} size={sizes.icone} />
      <AppText variant="corpsGras" color={colors.alerte}>
        {t('enSeance.douleur.court')}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bouton: {
    minHeight: sizes.pasAPas,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingHorizontal: spacing.m,
    borderRadius: radius.petit,
    borderWidth: sizes.bordure,
    borderColor: colors.alerte,
  },
  presse: { opacity: opacity.presse },
});

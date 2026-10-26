import { type StyleProp, StyleSheet, View, type ViewStyle } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

/**
 * Étiquette « Exemple » sur les données de la source fictive (`PROGRES_FICTIF`) : les records et niveaux
 * affichés doivent être des faits réels, on ne fait donc pas passer un exemple pour une vraie donnée.
 */
export function BadgeExemple({ style }: { style?: StyleProp<ViewStyle> }) {
  const { t } = useTranslation();
  return (
    <View style={[styles.badge, style]} accessible accessibilityLabel={t('progres.exempleA11y')}>
      <AppText variant="libelle" color={colors.texte2} style={styles.texte}>
        {t('progres.exemple')}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    borderRadius: radius.petit,
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xxs,
  },
  texte: { textTransform: 'uppercase' },
});

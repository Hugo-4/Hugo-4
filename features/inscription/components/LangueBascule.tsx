import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { LANGUES } from '@/lib/i18n';
import { spacing } from '@/theme/tokens';

/** Bascule FR / EN en haut de l'inscription : change la langue de toute l'app. */
export function LangueBascule() {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.ligne} accessibilityRole="radiogroup" accessibilityLabel={t('inscription.langue')}>
      {LANGUES.map((langue) => (
        <Chip
          key={langue}
          role="radio"
          label={langue.toUpperCase()}
          accessibilityLabel={t(`inscription.langues.${langue}`)}
          selectionne={i18n.language === langue}
          onPress={() => i18n.changeLanguage(langue)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', gap: spacing.s },
});

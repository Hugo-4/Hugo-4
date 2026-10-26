import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { dateLocale } from '@/lib/format';
import i18n from '@/lib/i18n';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  mois: string;
  onPrecedent: () => void;
  onSuivant: () => void;
};

/** « octobre 2026 » entre les boutons mois précédent / suivant (≥ 48 px avec la marge tactile). */
export function EnteteMois({ mois, onPrecedent, onSuivant }: Props) {
  const { t } = useTranslation();
  const texte = dateLocale(`${mois}-01`).toLocaleDateString(i18n.language, { month: 'long', year: 'numeric' });
  const libelle = texte.charAt(0).toLocaleUpperCase(i18n.language) + texte.slice(1);
  return (
    <View style={styles.ligne}>
      <IconButton accessibilityLabel={t('programme.calendrier.moisPrecedent')} onPress={onPrecedent}>
        <ChevronLeft color={colors.texte} size={sizes.icone} />
      </IconButton>
      <AppText variant="sousTitre" accessibilityRole="header" accessibilityLiveRegion="polite" style={styles.titre}>
        {libelle}
      </AppText>
      <IconButton accessibilityLabel={t('programme.calendrier.moisSuivant')} onPress={onSuivant}>
        <ChevronRight color={colors.texte} size={sizes.icone} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  titre: { flex: 1, textAlign: 'center' },
});

import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { formatJourDate } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = { date: string; estAujourdhui: boolean; onPrecedent: () => void; onSuivant: () => void };

/** Jour affiché : on remonte dans le journal, jamais au-delà d'aujourd'hui. */
export function SelecteurJour({ date, estAujourdhui, onPrecedent, onSuivant }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.ligne}>
      <IconButton accessibilityLabel={t('nutrition.jourPrecedent')} onPress={onPrecedent}>
        <ChevronLeft color={colors.texte} size={sizes.icone} />
      </IconButton>
      <AppText variant="corpsGras" accessibilityRole="header" accessibilityLiveRegion="polite">
        {estAujourdhui ? t('nutrition.aujourdhui') : formatJourDate(date)}
      </AppText>
      <IconButton accessibilityLabel={t('nutrition.jourSuivant')} onPress={onSuivant} disabled={estAujourdhui}>
        <ChevronRight color={estAujourdhui ? colors.ligne : colors.texte} size={sizes.icone} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.s },
});

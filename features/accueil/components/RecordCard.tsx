import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  texte: string;
};

export function RecordCard({ texte }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.ligne}>
        <Trophy color={colors.accent} size={sizes.icone + spacing.xs} />
        <View style={styles.texte}>
          <AppText variant="surTitre">{t('accueil.record.titre')}</AppText>
          <AppText variant="corps">{texte}</AppText>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  texte: { flex: 1, gap: spacing.xs },
});

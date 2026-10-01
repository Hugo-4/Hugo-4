import { Smile } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  onCheckin: () => void;
};

/** Remplace la carte Forme du jour tant que le check-in du matin n'est pas fait. */
export function CheckinCard({ onCheckin }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.ligne}>
        <Smile color={colors.accent} size={sizes.icone * 2} />
        <View style={styles.texte}>
          <AppText variant="sousTitre">{t('accueil.forme.checkinTitre')}</AppText>
          <AppText variant="secondaire">{t('accueil.forme.checkinTexte')}</AppText>
        </View>
      </View>
      <Button label={t('accueil.forme.checkinBouton')} onPress={onCheckin} />
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.l },
  texte: { flex: 1, gap: spacing.xs },
});

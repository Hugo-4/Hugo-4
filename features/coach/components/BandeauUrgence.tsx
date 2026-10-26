import { TriangleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Bandeau } from '@/components/Bandeau';
import { BoutonsUrgence } from '@/components/BoutonsUrgence';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Signes d'alerte repérés par le serveur : « Appelle le 15 ou le 112 », un bouton compose chaque numéro. */
export function BandeauUrgence() {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <Bandeau
        ton="urgence"
        icon={<TriangleAlert color={colors.danger} size={sizes.icone} />}
        texte={t('coach.urgence.texte')}
      />
      <BoutonsUrgence />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

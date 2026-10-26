import { Trash2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { colors, sizes, spacing } from '@/theme/tokens';

import { formatQuantite } from '../format';
import type { LigneRepas } from '../types';

type Props = { ligne: LigneRepas; onRetirer: () => void; desactive: boolean };

/** Un aliment noté : nom, quantité, calories et macronutriments, bouton pour le retirer. */
export function LigneAliment({ ligne, onRetirer, desactive }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.ligne}>
      <View style={styles.texte}>
        <AppText variant="corpsGras" numberOfLines={2}>
          {ligne.nom}
        </AppText>
        <AppText variant="libelle">
          {t('nutrition.repas.detail', {
            quantite: formatQuantite(ligne.quantite_g),
            kcal: formatQuantite(ligne.calories),
            p: formatQuantite(ligne.proteines_g),
            g: formatQuantite(ligne.glucides_g),
            l: formatQuantite(ligne.lipides_g),
          })}
        </AppText>
      </View>
      <IconButton accessibilityLabel={t('nutrition.repas.retirer', { nom: ligne.nom })} onPress={onRetirer} disabled={desactive}>
        <Trash2 color={colors.discret} size={sizes.icone} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s, minHeight: sizes.cibleTactile },
  texte: { flex: 1, gap: spacing.xxs },
});

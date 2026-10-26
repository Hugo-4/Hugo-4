import { Dumbbell } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Séance reçue sans aucun exercice : on l'explique et on propose de revenir. */
export function SeanceVide({ onFermer }: { onFermer: () => void }) {
  const { t } = useTranslation();
  return (
    <View style={styles.ecran}>
      <EmptyState
        icon={<Dumbbell color={colors.discret} size={sizes.icone * 2} />}
        titre={t('enSeance.vide.titre')}
        texte={t('enSeance.vide.texte')}
      />
      <Button label={t('enSeance.vide.fermer')} onPress={onFermer} />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, padding: spacing.ecran, gap: spacing.l },
});

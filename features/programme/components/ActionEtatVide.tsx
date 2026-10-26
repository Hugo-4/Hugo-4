import { StyleSheet, View } from 'react-native';

import { Button } from '@/components/Button';
import { spacing } from '@/theme/tokens';

type Props = { label: string; onPress: () => void };

/** [S] sous un état vide ou « introuvable » d'un écran sans marge (le bouton garde le bord d'écran de 16). */
export function ActionEtatVide({ label, onPress }: Props) {
  return (
    <View style={styles.bloc}>
      <Button label={label} variant="secondaire" onPress={onPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { paddingHorizontal: spacing.ecran, paddingBottom: spacing.ecran },
});

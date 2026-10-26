import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';

type Props = {
  titre: string;
  children: ReactNode;
};

/** Groupe de lignes de l'écran Profil, avec son sur-titre. */
export function GroupeRubriques({ titre, children }: Props) {
  return (
    <View style={styles.groupe}>
      <AppText variant="surTitre" accessibilityRole="header">
        {titre}
      </AppText>
      <View style={styles.lignes}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  groupe: { gap: spacing.s },
  lignes: { gap: spacing.xs },
});

import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/tokens';

type Props = {
  children: ReactNode;
};

/** Conteneur d'écran : fond sombre et marges de sécurité en haut (la barre d'onglets gère le bas). */
export function Screen({ children }: Props) {
  return (
    <SafeAreaView edges={['top', 'left', 'right']} style={styles.ecran}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: colors.fond },
});

import type { ReactNode } from 'react';
import { StyleSheet } from 'react-native';
import { type Edge, SafeAreaView } from 'react-native-safe-area-context';

import { colors } from '@/theme/tokens';

type Props = {
  children: ReactNode;
  /** Par défaut le haut (la barre d'onglets gère le bas) ; une feuille gère plutôt le bas. */
  edges?: Edge[];
};

/** Conteneur d'écran : fond sombre et marges de sécurité. */
export function Screen({ children, edges = ['top', 'left', 'right'] }: Props) {
  return (
    <SafeAreaView edges={edges} style={styles.ecran}>
      {children}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: colors.fond },
});

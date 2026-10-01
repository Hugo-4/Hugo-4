import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  icon?: ReactNode;
  titre: string;
  texte?: string;
};

export function EmptyState({ icon, titre, texte }: Props) {
  return (
    <View style={styles.conteneur}>
      {icon}
      <AppText variant="sousTitre" style={styles.centre}>
        {titre}
      </AppText>
      {texte ? (
        <AppText variant="secondaire" style={styles.centre}>
          {texte}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.m, padding: spacing.xxl },
  centre: { textAlign: 'center' },
});

import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { EmptyState } from './EmptyState';
import { Screen } from './Screen';

type Props = {
  titre: string;
  icon: ReactNode;
};

/** Écran provisoire pour les onglets qui seront construits dans les étapes suivantes. */
export function PlaceholderScreen({ titre, icon }: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={styles.entete}>
        <AppText variant="titre" accessibilityRole="header">
          {titre}
        </AppText>
      </View>
      <EmptyState icon={icon} titre={t('commun.bientotTitre')} texte={t('commun.ecranAVenir')} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  entete: { paddingHorizontal: spacing.ecran, paddingTop: spacing.l },
});

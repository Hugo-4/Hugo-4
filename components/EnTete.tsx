import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { IconButton } from './IconButton';

type Props = {
  titre: string;
  /** Par défaut : écran précédent. */
  onRetour?: () => void;
  /** Action à droite (bouton icône, puce…). */
  action?: ReactNode;
  sousTitre?: string;
};

/** En-tête d'un écran secondaire : retour, titre, action éventuelle. */
export function EnTete({ titre, onRetour, action, sousTitre }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.entete}>
      <IconButton accessibilityLabel={t('commun.retour')} onPress={onRetour ?? (() => router.back())}>
        <ArrowLeft color={colors.texte} size={sizes.icone} />
      </IconButton>
      <View style={styles.titre}>
        <AppText variant="sousTitre" accessibilityRole="header" numberOfLines={1}>
          {titre}
        </AppText>
        {sousTitre ? (
          <AppText variant="libelle" numberOfLines={1}>
            {sousTitre}
          </AppText>
        ) : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, paddingHorizontal: spacing.ecran, paddingVertical: spacing.s },
  titre: { flex: 1, gap: spacing.xxs },
});

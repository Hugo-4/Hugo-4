import { router } from 'expo-router';
import { Bell } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, sizes, spacing } from '@/theme/tokens';

/** État vide de la liste (dans la liste elle-même : tirer pour rafraîchir reste possible). */
export function NotificationsVides() {
  const { t } = useTranslation();
  return (
    <View style={styles.vide}>
      <EmptyState
        icon={<Bell color={colors.discret} size={sizes.icone * 2} />}
        titre={t('notifications.videTitre')}
        texte={t('notifications.videTexte')}
      />
      <Button label={t('notifications.regler')} onPress={() => router.push('/compte/preferences')} />
    </View>
  );
}

const styles = StyleSheet.create({
  vide: { flex: 1, gap: spacing.l, justifyContent: 'center' },
});

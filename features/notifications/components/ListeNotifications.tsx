import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { colors, spacing } from '@/theme/tokens';

import { ouvrirDestination } from '../destination';
import { NOTIFICATIONS_FICTIF } from '../source';
import type { NotificationCentre } from '../types';
import { useMarquerLue, useMarquerToutLu } from '../useNotifications';
import { LigneNotification } from './LigneNotification';
import { NotificationsVides } from './NotificationsVides';

type Props = {
  notifications: NotificationCentre[];
  rafraichissement: boolean;
  onRafraichir: () => void;
};

/**
 * Liste des notifications, « Tout marquer comme lu » [L] ; toucher une ligne la marque lue et ouvre l'écran concerné.
 * Liste vide : explication + « Régler mes notifications », toujours dans la liste (tirer pour rafraîchir).
 */
export function ListeNotifications({ notifications, rafraichissement, onRafraichir }: Props) {
  const { t } = useTranslation();
  const marquerLue = useMarquerLue();
  const toutLire = useMarquerToutLu();
  const nonLues = notifications.filter((n) => !n.lue).length;

  const ouvrir = (notification: NotificationCentre) => {
    if (!notification.lue) marquerLue.mutate(notification.id);
    ouvrirDestination(notification);
  };

  return (
    <FlatList
      data={notifications}
      keyExtractor={(n) => n.id}
      renderItem={({ item }) => <LigneNotification notification={item} onPress={() => ouvrir(item)} />}
      contentContainerStyle={styles.liste}
      ListEmptyComponent={<NotificationsVides />}
      refreshControl={
        <RefreshControl
          refreshing={rafraichissement}
          onRefresh={onRafraichir}
          tintColor={colors.accent}
          colors={[colors.accent]}
          progressBackgroundColor={colors.carte}
        />
      }
      ListHeaderComponent={
        <View style={styles.entete}>
          {NOTIFICATIONS_FICTIF ? <Bandeau texte={t('notifications.fictif')} /> : null}
          {marquerLue.isError || toutLire.isError ? <MessageErreur texte={t('notifications.erreurMarquage')} /> : null}
          {notifications.length ? (
            <View style={styles.actions}>
              <AppText variant="secondaire" accessibilityLiveRegion="polite">
                {t('notifications.nonLues', { count: nonLues })}
              </AppText>
              <Button
                label={t('notifications.toutLire')}
                variant="discret"
                disabled={nonLues === 0 || toutLire.isPending}
                onPress={() => toutLire.mutate()}
              />
            </View>
          ) : null}
        </View>
      }
    />
  );
}

const styles = StyleSheet.create({
  liste: { flexGrow: 1, paddingVertical: spacing.ecran, gap: spacing.s },
  entete: { gap: spacing.s },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.s },
});

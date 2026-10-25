import { Bell } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { ListeNotifications } from '@/features/notifications/components/ListeNotifications';
import { useCentreNotifications } from '@/features/notifications/useNotifications';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

/** Notifications (FRONTEND.md §4.8) : lues / non lues, chaque ligne ouvre l'écran concerné. */
export default function NotificationsScreen() {
  const { t } = useTranslation();
  const centre = useCentreNotifications();
  const notifications = centre.data?.notifications ?? [];

  return (
    <Screen>
      <EnTete titre={t('notifications.titre')} />
      <View style={styles.contenu}>
        <EtatsEcran
          chargement={centre.isPending}
          erreur={centre.error}
          aDesDonnees={centre.data !== undefined}
          vide={notifications.length === 0}
          onReessayer={centre.refetch}
          squelette={
            <View style={styles.squelette}>
              {[0, 1, 2, 3].map((i) => (
                <Skeleton key={i} hauteur={sizes.anneauForme * 0.8} arrondi={radius.petit} />
              ))}
            </View>
          }
          etatVide={{
            icon: <Bell color={colors.discret} size={sizes.icone * 2} />,
            titre: t('notifications.videTitre'),
            texte: t('notifications.videTexte'),
          }}>
          <ListeNotifications
            notifications={notifications}
            rafraichissement={centre.isRefetching}
            onRafraichir={centre.refetch}
          />
        </EtatsEcran>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flex: 1, paddingHorizontal: spacing.ecran },
  squelette: { paddingVertical: spacing.ecran, gap: spacing.s },
});

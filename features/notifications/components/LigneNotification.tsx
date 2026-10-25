import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import i18n from '@/lib/i18n';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { formatIlYa } from '../format';
import type { NotificationCentre } from '../types';
import { IconeNotification } from './IconeNotification';

const libelleType = (type: string) => {
  const cle = `notifications.types.${type}`;
  return String(i18n.t((i18n.exists(cle) ? cle : 'notifications.types.autre') as never));
};

/**
 * Une notification : type, titre et texte du serveur, moment. Non lue : mention « Nouveau », titre en gras
 * et fond plus clair (jamais la couleur seule). Toucher l'ouvre.
 */
export function LigneNotification({ notification, onPress }: { notification: NotificationCentre; onPress: () => void }) {
  const { t } = useTranslation();
  const nonLue = !notification.lue;
  const type = libelleType(notification.type);
  const moment = formatIlYa(notification.cree_le);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('notifications.a11yLigne', {
        etat: t(nonLue ? 'notifications.a11yNonLue' : 'notifications.a11yLue'),
        type,
        titre: notification.titre,
        corps: notification.corps ?? '',
        moment,
      })}
      onPress={onPress}
      style={({ pressed }) => [styles.ligne, nonLue && styles.nonLue, pressed && styles.presse]}>
      <IconeNotification type={notification.type} nonLue={nonLue} />
      <View style={styles.texte}>
        <View style={styles.entete}>
          <AppText variant="libelle" style={styles.type} numberOfLines={1}>
            {type}
          </AppText>
          {nonLue ? (
            <AppText variant="libelle" color={colors.accent}>
              {t('notifications.nonLue')}
            </AppText>
          ) : null}
        </View>
        <AppText variant={nonLue ? 'corpsGras' : 'corps'}>{notification.titre}</AppText>
        {notification.corps ? <AppText variant="secondaire">{notification.corps}</AppText> : null}
        <AppText variant="libelle">{moment}</AppText>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    gap: spacing.m,
    minHeight: sizes.pasAPas,
    padding: spacing.carte,
    borderRadius: radius.petit,
    backgroundColor: colors.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
  },
  nonLue: { backgroundColor: colors.carte2 },
  texte: { flex: 1, gap: spacing.xxs },
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  type: { flexShrink: 1 },
  presse: { opacity: opacity.presse },
});

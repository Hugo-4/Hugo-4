import { Bell } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { formatDateLongue } from '@/lib/format';
import { colors, fontSizes, opacity, radius, sizes, spacing } from '@/theme/tokens';

type Props = {
  prenom: string;
  initiales: string;
  notificationsNonLues: number;
  onNotifications: () => void;
  onProfil: () => void;
};

export function AccueilHeader({ prenom, initiales, notificationsNonLues, onNotifications, onProfil }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.entete}>
      <View style={styles.texte}>
        <AppText variant="libelle">
          {formatDateLongue(new Date())}
        </AppText>
        <AppText variant="titre" accessibilityRole="header" numberOfLines={1}>
          {t('accueil.bonjour', { prenom })}
        </AppText>
      </View>
      <View>
        <IconButton
          accessibilityLabel={t('accueil.a11yNotifications', { count: notificationsNonLues })}
          onPress={onNotifications}>
          <Bell color={colors.texte} size={sizes.icone} />
        </IconButton>
        {notificationsNonLues > 0 ? (
          <View style={styles.pastille} pointerEvents="none">
            <AppText variant="libelle" color={colors.surAccent} style={styles.compteur}>
              {notificationsNonLues}
            </AppText>
          </View>
        ) : null}
      </View>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('accueil.a11yProfil')}
        onPress={onProfil}
        style={({ pressed }) => [styles.avatar, pressed && styles.presse]}>
        <AppText variant="corpsGras" color={colors.surAccent}>
          {initiales}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  texte: { flex: 1 },
  pastille: {
    position: 'absolute',
    top: -spacing.xs,
    right: -spacing.xs,
    minWidth: sizes.iconePetite + spacing.xs,
    height: sizes.iconePetite + spacing.xs,
    borderRadius: radius.rond,
    backgroundColor: colors.alerte,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.xs,
  },
  compteur: { fontSize: fontSizes.xs },
  avatar: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: radius.rond,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  presse: { opacity: opacity.presse },
});

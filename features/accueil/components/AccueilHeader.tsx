import { Bell } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { formatDateLongue } from '@/lib/format';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

type Props = {
  prenom: string | null;
  onNotifications: () => void;
  onProfil: () => void;
};

export function AccueilHeader({ prenom, onNotifications, onProfil }: Props) {
  const { t } = useTranslation();
  const initiale = prenom?.trim().charAt(0).toUpperCase() ?? '';
  return (
    <View style={styles.entete}>
      <View style={styles.texte}>
        <AppText variant="libelle">{formatDateLongue(new Date())}</AppText>
        <AppText variant="titre" accessibilityRole="header" numberOfLines={1}>
          {prenom ? t('accueil.bonjour', { prenom }) : t('accueil.bonjourSansPrenom')}
        </AppText>
      </View>
      <IconButton accessibilityLabel={t('accueil.a11yNotifications')} onPress={onNotifications}>
        <Bell color={colors.texte} size={sizes.icone} />
      </IconButton>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={t('accueil.a11yProfil')}
        onPress={onProfil}
        style={({ pressed }) => [styles.avatar, pressed && styles.presse]}>
        <AppText variant="corpsGras" color={colors.surAccent}>
          {initiale}
        </AppText>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  texte: { flex: 1 },
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

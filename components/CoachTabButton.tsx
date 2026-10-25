import { MessageCircle } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { PointBadge } from './PointBadge';

type Props = {
  label: string;
  actif: boolean;
  onPress: () => void;
  /** Une proposition du coach attend une réponse. */
  badge?: string | null;
};

/** Bouton central de la barre d'onglets : rond, surélevé, couleur accent. */
export function CoachTabButton({ label, actif, onPress, badge }: Props) {
  return (
    <Pressable
      accessibilityRole="tab"
      accessibilityState={{ selected: actif }}
      accessibilityLabel={badge ? `${label}, ${badge}` : label}
      onPress={onPress}
      style={({ pressed }) => [styles.onglet, pressed && styles.presse]}>
      <View style={[styles.rond, actif && styles.rondActif]}>
        <MessageCircle color={colors.surAccent} size={sizes.icone + spacing.xs} />
        {badge ? <PointBadge /> : null}
      </View>
      <AppText variant="libelle" color={actif ? colors.accent : colors.texte2} numberOfLines={1}>
        {label}
      </AppText>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  onglet: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: spacing.xs,
  },
  rond: {
    width: sizes.boutonCoach,
    height: sizes.boutonCoach,
    borderRadius: radius.rond,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -sizes.elevationCoach,
    borderWidth: spacing.xs,
    borderColor: colors.fond,
  },
  rondActif: { borderColor: colors.ligne },
  presse: { opacity: opacity.presse },
});

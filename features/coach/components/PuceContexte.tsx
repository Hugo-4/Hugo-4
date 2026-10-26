import { X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { CIBLE, HAUTEUR_PUCE, MARGE_TACTILE } from './dimensions';

type Props = {
  libelle: string;
  onRetirer: () => void;
};

/** « Sur : Force · bas du corps » avec une croix pour parler d'autre chose. */
export function PuceContexte({ libelle, onRetirer }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.ligne}>
      <View style={styles.puce}>
        <AppText variant="secondaire" color={colors.texte} numberOfLines={1} style={styles.texte}>
          {t('coach.contexte.sur', { titre: libelle })}
        </AppText>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('coach.contexte.a11yRetirer', { titre: libelle })}
          onPress={onRetirer}
          hitSlop={MARGE_TACTILE}
          style={({ pressed }) => [styles.croix, pressed && styles.presse]}>
          <X color={colors.texte2} size={sizes.iconePetite} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { paddingHorizontal: spacing.ecran, flexDirection: 'row' },
  puce: {
    flexDirection: 'row',
    alignItems: 'center',
    minHeight: HAUTEUR_PUCE,
    maxWidth: '100%',
    paddingLeft: spacing.m,
    borderRadius: radius.rond,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    backgroundColor: colors.carte2,
  },
  texte: { flexShrink: 1 },
  croix: { width: CIBLE - spacing.s, height: HAUTEUR_PUCE, alignItems: 'center', justifyContent: 'center' },
  presse: { opacity: opacity.presse },
});

import { Minus, Plus } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { formatNombre } from '@/lib/format';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { AppText } from './AppText';

type Props = {
  libelle: string;
  /** Unité affichée sous la valeur (« kg », « reps », « s »). */
  unite: string;
  valeur: number;
  pas: number;
  min?: number;
  max?: number;
  onChange: (valeur: number) => void;
};

/** − valeur + : gros chiffres et boutons de 48 px, utilisable d'une main. */
export function PasAPas({ libelle, unite, valeur, pas, min = 0, max = 1000, onChange }: Props) {
  const { t } = useTranslation();
  const decimales = Number.isInteger(pas) && Number.isInteger(valeur) ? 0 : 1;
  const changer = (delta: number) => onChange(Math.min(max, Math.max(min, Math.round((valeur + delta) * 10) / 10)));

  return (
    <View style={styles.bloc}>
      <AppText variant="libelle">{libelle}</AppText>
      <View style={styles.ligne}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('commun.moins', { libelle, pas: formatNombre(pas, decimales) })}
          onPress={() => changer(-pas)}
          disabled={valeur <= min}
          style={({ pressed }) => [styles.bouton, (pressed || valeur <= min) && styles.presse]}>
          <Minus color={colors.texte} size={sizes.icone} />
        </Pressable>
        <View
          style={styles.valeur}
          accessible
          accessibilityRole="adjustable"
          accessibilityLabel={libelle}
          accessibilityValue={{ text: `${formatNombre(valeur, decimales)} ${unite}` }}
          accessibilityActions={[{ name: 'increment' }, { name: 'decrement' }]}
          onAccessibilityAction={(e) => changer(e.nativeEvent.actionName === 'increment' ? pas : -pas)}>
          <AppText variant="display" maxFontSizeMultiplier={multiplicateurMax}>
            {formatNombre(valeur, decimales)}
          </AppText>
          <AppText variant="libelle">{unite}</AppText>
        </View>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={t('commun.plus', { libelle, pas: formatNombre(pas, decimales) })}
          onPress={() => changer(pas)}
          disabled={valeur >= max}
          style={({ pressed }) => [styles.bouton, (pressed || valeur >= max) && styles.presse]}>
          <Plus color={colors.texte} size={sizes.icone} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { flex: 1, gap: spacing.xs, alignItems: 'center' },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  bouton: {
    width: sizes.pasAPas,
    height: sizes.pasAPas,
    borderRadius: radius.rond,
    backgroundColor: colors.carte2,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    alignItems: 'center',
    justifyContent: 'center',
  },
  valeur: { minWidth: sizes.pasAPas * 1.5, alignItems: 'center' },
  presse: { opacity: opacity.presse },
});

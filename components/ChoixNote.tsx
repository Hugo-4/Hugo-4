import { Pressable, StyleSheet, View } from 'react-native';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  libelle: string;
  /** Valeurs proposées, dans l'ordre (ex. RPE 6 à 10, intensité 0 à 10). */
  valeurs: number[];
  valeur: number | null;
  onChange: (valeur: number) => void;
  /** Libellé lu par le lecteur d'écran pour une valeur (« RPE 8 »). */
  a11yValeur: (valeur: number) => string;
};

/** Une note en un geste : une rangée de pastilles (RPE, intensité de douleur, fatigue…). */
export function ChoixNote({ libelle, valeurs, valeur, onChange, a11yValeur }: Props) {
  return (
    <View style={styles.bloc}>
      <AppText variant="libelle">{libelle}</AppText>
      <View style={styles.ligne} accessibilityRole="radiogroup" accessibilityLabel={libelle}>
        {valeurs.map((v) => {
          const actif = v === valeur;
          return (
            <Pressable
              key={v}
              accessibilityRole="radio"
              accessibilityState={{ checked: actif }}
              accessibilityLabel={a11yValeur(v)}
              onPress={() => onChange(v)}
              style={({ pressed }) => [styles.pastille, actif && styles.active, pressed && styles.presse]}>
              <AppText variant="chiffre" color={actif ? colors.surAccent : colors.texte}>
                {v}
              </AppText>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  ligne: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  pastille: {
    flexGrow: 1,
    minWidth: sizes.pasAPas,
    minHeight: sizes.pasAPas,
    borderRadius: radius.petit,
    backgroundColor: colors.carte2,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    alignItems: 'center',
    justifyContent: 'center',
  },
  active: { backgroundColor: colors.accent, borderColor: colors.accent },
  presse: { opacity: opacity.presse },
});

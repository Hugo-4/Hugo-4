import { Check, Minus, Pause } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, radius, sizes } from '@/theme/tokens';

import type { StatutSemaine } from '../types';

type Props = {
  statut: StatutSemaine;
  /** Libellé lu par le lecteur d'écran (date, statut, séances) ; absent pour la légende. */
  accessibilityLabel?: string;
  petite?: boolean;
};

/** Pastille d'une semaine : forme et icône différentes pour chaque statut (jamais la couleur seule). */
export function PastilleSemaine({ statut, accessibilityLabel, petite }: Props) {
  const taille = petite ? sizes.icone : sizes.pastilleJour;
  const icone = petite ? sizes.iconePetite - sizes.bordureForte * 2 : sizes.iconePetite;
  return (
    <View
      style={[styles.pastille, styles[statut], { width: taille, height: taille }]}
      accessible={Boolean(accessibilityLabel)}
      accessibilityLabel={accessibilityLabel}
      importantForAccessibility={accessibilityLabel ? 'yes' : 'no-hide-descendants'}>
      {statut === 'reussie' ? <Check color={colors.surAccent} size={icone} /> : null}
      {statut === 'non_reussie' ? <Minus color={colors.discret} size={icone} /> : null}
      {statut === 'pause' ? <Pause color={colors.discret} size={icone} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pastille: { borderRadius: radius.rond, alignItems: 'center', justifyContent: 'center' },
  reussie: { backgroundColor: colors.accent },
  non_reussie: { borderWidth: sizes.bordureForte, borderColor: colors.discret },
  pause: { backgroundColor: colors.carte2 },
  en_cours: { borderWidth: sizes.bordureForte, borderColor: colors.accent },
});

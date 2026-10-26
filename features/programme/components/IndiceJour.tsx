import { Check, Trophy, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { colors, sizes, spacing } from '@/theme/tokens';

import { iconeType } from '../iconesType';
import type { EtatJour } from '../presentation';
import { IntensiteTraits } from './IntensiteTraits';

type Props = { etat: EtatJour | null };

/**
 * Sous le numéro du jour : l'icône du type de séance (lisible sans couleur), puis un trophée (compétition),
 * une coche (faite), une croix (manquée) ou l'intensité en traits. Largeur maximale : 16 + 2 + 28 = 46 px.
 * Décoratif pour le lecteur d'écran : le libellé de la case dit déjà tout.
 */
export function IndiceJour({ etat }: Props) {
  const IconeType = iconeType(etat?.type);
  return (
    <View style={styles.ligne} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      {IconeType ? <IconeType color={colors.texte2} size={sizes.iconePetite} /> : null}
      {etat?.competition ? (
        <Trophy color={colors.accent} size={sizes.iconePetite} />
      ) : etat?.statut === 'fait' ? (
        <Check color={colors.accent} size={sizes.iconePetite} />
      ) : etat?.statut === 'manque' ? (
        <X color={colors.alerte} size={sizes.iconePetite} />
      ) : etat?.intensite ? (
        <IntensiteTraits niveau={etat.intensite} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs, height: sizes.iconePetite },
});

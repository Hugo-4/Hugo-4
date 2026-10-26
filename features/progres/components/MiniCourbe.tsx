import { View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { colors, sizes } from '@/theme/tokens';

/** Pas de jeton dédié à la mini-courbe : on prend les plus proches (à ajouter dans theme/tokens.ts). */
const LARGEUR = sizes.graphique / 2;
const HAUTEUR = sizes.pastilleJour;

/**
 * Mini-courbe décorative (tendance d'un test sur une ligne). Masquée pour le lecteur d'écran :
 * la ligne qui la contient donne déjà la dernière valeur et la date en texte.
 */
export function MiniCourbe({ valeurs }: { valeurs: number[] }) {
  if (valeurs.length < 2) return <View style={{ width: LARGEUR, height: HAUTEUR }} />;
  const min = Math.min(...valeurs);
  const ecart = Math.max(...valeurs) - min;
  const marge = sizes.pointCourbe;
  const x = (i: number) => marge + (i / (valeurs.length - 1)) * (LARGEUR - 2 * marge);
  const y = (v: number) => (ecart === 0 ? HAUTEUR / 2 : marge + (1 - (v - min) / ecart) * (HAUTEUR - 2 * marge));
  const dernier = valeurs.length - 1;

  return (
    <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
      <Svg width={LARGEUR} height={HAUTEUR}>
        <Polyline
          points={valeurs.map((v, i) => `${x(i)},${y(v)}`).join(' ')}
          fill="none"
          stroke={colors.accent}
          strokeWidth={sizes.traitCourbe}
          strokeLinejoin="round"
        />
        <Circle cx={x(dernier)} cy={y(valeurs[dernier])} r={sizes.pointCourbe - sizes.bordure} fill={colors.accent} />
      </Svg>
    </View>
  );
}

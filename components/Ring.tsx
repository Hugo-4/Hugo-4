import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle } from 'react-native-svg';

import { colors } from '@/theme/tokens';

type Props = {
  /** Valeur entre 0 et 1. */
  progression: number;
  taille: number;
  epaisseur: number;
  couleur?: string;
  children?: ReactNode;
};

/** Anneau de progression (forme du jour, objectifs). */
export function Ring({ progression, taille, epaisseur, couleur = colors.accent, children }: Props) {
  const rayon = (taille - epaisseur) / 2;
  const circonference = 2 * Math.PI * rayon;
  const borne = Math.min(Math.max(progression, 0), 1);

  return (
    <View style={{ width: taille, height: taille }}>
      <Svg width={taille} height={taille} style={StyleSheet.absoluteFill}>
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={colors.carte2}
          strokeWidth={epaisseur}
          fill="none"
        />
        <Circle
          cx={taille / 2}
          cy={taille / 2}
          r={rayon}
          stroke={couleur}
          strokeWidth={epaisseur}
          strokeLinecap="round"
          strokeDasharray={`${circonference} ${circonference}`}
          strokeDashoffset={circonference * (1 - borne)}
          fill="none"
          transform={`rotate(-90 ${taille / 2} ${taille / 2})`}
        />
      </Svg>
      <View style={styles.centre}>{children}</View>
    </View>
  );
}

const styles = StyleSheet.create({
  centre: { ...StyleSheet.absoluteFill, alignItems: 'center', justifyContent: 'center' },
});

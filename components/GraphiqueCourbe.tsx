import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Circle, Polyline } from 'react-native-svg';

import { colors, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

export type Point = { libelle: string; valeur: number };

type Props = {
  points: Point[];
  /** Résumé lu par le lecteur d'écran (première et dernière valeur, tendance). */
  resume: string;
  /** Valeurs extrêmes affichées à gauche (déjà formatées, avec l'unité). */
  formatValeur: (valeur: number) => string;
  hauteur?: number;
};

/** Courbe simple (évolution d'un test) en SVG, avec la première et la dernière date sous le tracé. */
export function GraphiqueCourbe({ points, resume, formatValeur, hauteur = sizes.graphique }: Props) {
  const [largeur, setLargeur] = useState(0);
  const valeurs = points.map((p) => p.valeur);
  const min = Math.min(...valeurs);
  const max = Math.max(...valeurs);
  const ecart = max - min || 1;
  const marge = sizes.pointCourbe + sizes.traitCourbe;
  const x = (i: number) => (points.length > 1 ? marge + (i / (points.length - 1)) * (largeur - 2 * marge) : largeur / 2);
  const y = (v: number) => marge + (1 - (v - min) / ecart) * (hauteur - 2 * marge);
  const trace = points.map((p, i) => `${x(i)},${y(p.valeur)}`).join(' ');

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={resume} style={styles.bloc}>
      <View style={styles.ligne}>
        <View style={[styles.echelle, { height: hauteur }]}>
          <AppText variant="libelle">{formatValeur(max)}</AppText>
          <AppText variant="libelle">{formatValeur(min)}</AppText>
        </View>
        <View style={[styles.trace, { height: hauteur }]} onLayout={(e) => setLargeur(e.nativeEvent.layout.width)}>
          {largeur > 0 && points.length ? (
            <Svg width={largeur} height={hauteur}>
              <Polyline points={trace} fill="none" stroke={colors.accent} strokeWidth={sizes.traitCourbe} />
              {points.map((p, i) => (
                <Circle key={`${p.libelle}-${i}`} cx={x(i)} cy={y(p.valeur)} r={sizes.pointCourbe} fill={colors.accent} />
              ))}
            </Svg>
          ) : null}
        </View>
      </View>
      {points.length ? (
        <View style={styles.dates}>
          <AppText variant="libelle">{points[0].libelle}</AppText>
          <AppText variant="libelle">{points[points.length - 1].libelle}</AppText>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  ligne: { flexDirection: 'row', gap: spacing.s },
  echelle: { justifyContent: 'space-between' },
  trace: { flex: 1 },
  dates: { flexDirection: 'row', justifyContent: 'space-between' },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import Svg, { Rect } from 'react-native-svg';

import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

export type Barre = { libelle: string; valeur: number; misEnAvant?: boolean };

type Props = {
  barres: Barre[];
  /** Zone optimale (ex. charge hebdomadaire conseillée), dessinée en bande derrière les barres. */
  zone?: { min: number; max: number };
  /** Résumé lu par le lecteur d'écran (ex. « Charge des 8 dernières semaines : … »). */
  resume: string;
  hauteur?: number;
};

/** Barres simples en SVG ; les libellés sont sous le graphique (taille de texte du téléphone respectée). */
export function GraphiqueBarres({ barres, zone, resume, hauteur = sizes.graphique }: Props) {
  const [largeur, setLargeur] = useState(0);
  const max = Math.max(1, ...barres.map((b) => b.valeur), zone?.max ?? 0);
  const y = (v: number) => hauteur - (v / max) * hauteur;
  const pas = barres.length ? largeur / barres.length : 0;
  const epaisseur = Math.max(spacing.xs, pas * 0.6);

  return (
    <View accessible accessibilityRole="image" accessibilityLabel={resume} style={styles.bloc}>
      <View onLayout={(e) => setLargeur(e.nativeEvent.layout.width)} style={{ height: hauteur }}>
        {largeur > 0 ? (
          <Svg width={largeur} height={hauteur}>
            {zone ? (
              <Rect x={0} y={y(zone.max)} width={largeur} height={y(zone.min) - y(zone.max)} fill={colors.accent} opacity={opacity.zone} />
            ) : null}
            {barres.map((b, i) => (
              <Rect
                key={`${b.libelle}-${i}`}
                x={i * pas + (pas - epaisseur) / 2}
                y={y(b.valeur)}
                width={epaisseur}
                height={Math.max(0, hauteur - y(b.valeur))}
                rx={radius.petit / 3}
                fill={b.misEnAvant ? colors.accent : colors.texte2}
              />
            ))}
          </Svg>
        ) : null}
      </View>
      <View style={styles.libelles}>
        {barres.map((b, i) => (
          <AppText key={`${b.libelle}-${i}`} variant="libelle" style={styles.libelle} numberOfLines={1}>
            {b.libelle}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  libelles: { flexDirection: 'row' },
  libelle: { flex: 1, textAlign: 'center' },
});

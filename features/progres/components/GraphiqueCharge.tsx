import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { GraphiqueBarres } from '@/components/GraphiqueBarres';
import { spacing } from '@/theme/tokens';

import { formatSemaineCourte, formatValeur } from '../format';
import type { ChargeSemaines } from '../types';

/**
 * Barres de charge par semaine avec la zone optimale du serveur, et leur résumé en texte.
 * Sous les barres, seulement la première semaine (à gauche) et la dernière (à droite, « Cette semaine » si elle est
 * en cours) : `GraphiqueBarres` enferme chaque libellé dans la largeur d'une barre (≈ 27 px pour 12 semaines),
 * trop étroite pour une date. Ses libellés restent donc vides et les dates sont posées sur une ligne à part.
 */
export function GraphiqueCharge({ charge }: { charge: ChargeSemaines }) {
  const { t } = useTranslation();
  const { semaines, zone_optimale: zone, unite } = charge;
  const n = semaines.length;
  const premiere = semaines[0];
  const derniere = semaines[n - 1];
  const resume =
    t('progres.charge.resume', {
      nombre: n,
      premiere: formatValeur(premiere.charge, unite),
      derniere: formatValeur(derniere.charge, unite),
    }) + (zone ? t('progres.charge.resumeZone', { min: formatValeur(zone.min), max: formatValeur(zone.max, unite) }) : '');

  return (
    <Card>
      <AppText variant="surTitre">{t('progres.charge.graphique')}</AppText>
      <View style={styles.graphique}>
        <GraphiqueBarres
          barres={semaines.map((s) => ({ libelle: '', valeur: s.charge, misEnAvant: s.en_cours }))}
          zone={zone ?? undefined}
          resume={resume}
        />
        <View style={styles.dates} accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <AppText variant="libelle" style={styles.date}>
            {formatSemaineCourte(premiere.debut)}
          </AppText>
          {n > 1 ? (
            <AppText variant="libelle" style={[styles.date, styles.droite]}>
              {derniere.en_cours ? t('progres.charge.semaineEnCoursCourt') : formatSemaineCourte(derniere.debut)}
            </AppText>
          ) : null}
        </View>
      </View>
      <AppText variant="libelle">{t(zone ? 'progres.charge.legendeZone' : 'progres.charge.legende')}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  graphique: { gap: spacing.xxs },
  dates: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.s },
  date: { flexShrink: 1 },
  droite: { textAlign: 'right' },
});

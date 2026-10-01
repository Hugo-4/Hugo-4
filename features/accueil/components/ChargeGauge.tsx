import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import type { NiveauCharge } from '../types';

type Props = {
  niveau: NiveauCharge;
  /** Position du curseur renvoyée par le serveur, entre 0 et 1. */
  position: number;
};

const CLES = {
  faible: 'accueil.semaine.chargeFaible',
  optimale: 'accueil.semaine.chargeOptimale',
  elevee: 'accueil.semaine.chargeElevee',
} as const;

const COULEURS: Record<NiveauCharge, string> = {
  faible: colors.discret,
  optimale: colors.accent,
  elevee: colors.alerte,
};

/** Jauge en trois zones (faible, optimale, élevée) avec un curseur. */
export function ChargeGauge({ niveau, position }: Props) {
  const { t } = useTranslation();
  const borne = Math.min(Math.max(position, 0), 1);
  const libelleNiveau = t(CLES[niveau]);

  return (
    <View accessible accessibilityLabel={t('accueil.semaine.a11yCharge', { niveau: libelleNiveau })} style={styles.bloc}>
      <View style={styles.entete}>
        <AppText variant="libelle">{t('accueil.semaine.charge')}</AppText>
        <AppText variant="corpsGras" color={COULEURS[niveau]}>
          {libelleNiveau}
        </AppText>
      </View>
      <View style={styles.piste}>
        <View style={[styles.zone, { backgroundColor: colors.ligne }]} />
        <View style={[styles.zone, { backgroundColor: colors.accent }]} />
        <View style={[styles.zone, { backgroundColor: colors.alerte }]} />
        <View style={[styles.curseur, { left: `${borne * 100}%` }]} />
      </View>
      <View style={styles.legende}>
        {(Object.keys(CLES) as NiveauCharge[]).map((cle) => (
          <AppText key={cle} variant="libelle">
            {t(CLES[cle])}
          </AppText>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  piste: { flexDirection: 'row', height: sizes.jauge, gap: spacing.xxs },
  zone: { flex: 1, borderRadius: radius.rond },
  curseur: {
    position: 'absolute',
    top: -spacing.xs,
    width: spacing.xs,
    height: sizes.jauge + spacing.s,
    marginLeft: -spacing.xxs,
    borderRadius: radius.rond,
    backgroundColor: colors.texte,
  },
  legende: { flexDirection: 'row', justifyContent: 'space-between' },
});

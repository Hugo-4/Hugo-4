import { CircleCheck, TrendingDown, TrendingUp, TriangleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { ZoneCharge } from '../presentation';

const COULEURS: Record<ZoneCharge, string> = {
  optimale: colors.accent,
  sous_charge: colors.texte2,
  vigilance: colors.vigilance,
  danger: colors.alerte,
};

const ICONES = { optimale: CircleCheck, sous_charge: TrendingDown, vigilance: TrendingUp, danger: TriangleAlert };

/** Zone de charge décidée par le serveur : icône + libellé (la couleur ne porte jamais seule l'information). */
export function ZoneChargeLibelle({ zone }: { zone: ZoneCharge }) {
  const { t } = useTranslation();
  const Icone = ICONES[zone];
  return (
    <View style={styles.ligne}>
      <Icone color={COULEURS[zone]} size={sizes.icone} />
      <AppText variant="sousTitre" color={COULEURS[zone]} style={styles.texte}>
        {t(`progres.charge.zone.${zone}`)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  texte: { flex: 1 },
});

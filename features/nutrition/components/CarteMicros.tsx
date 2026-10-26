import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { colors, spacing } from '@/theme/tokens';

import { formatQuantite } from '../format';
import { MICROS, type CleMicro, type Nutriments } from '../types';

type Props = { total: Nutriments; surveilles: string[] | null };

const normaliser = (s: string) =>
  s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/µ/g, 'u').replace(/[\s-]+/g, '_');

/** Le coach peut écrire « fer », « fer_mg » ou « Vitamine D » : on compare le début de la clé. */
const estSurveille = (cle: CleMicro, liste: string[]) => liste.map(normaliser).some((s) => s && (cle === s || cle.startsWith(`${s}_`)));

/** Micronutriments notés ce jour ; ceux que le coach surveille passent en tête. Aucun seuil calculé par l'app. */
export function CarteMicros({ total, surveilles }: Props) {
  const { t } = useTranslation();
  const liste = surveilles ?? [];
  const cles = (Object.keys(MICROS) as CleMicro[])
    .map((cle) => ({ cle, valeur: total.micros[cle] ?? 0, suivi: estSurveille(cle, liste) }))
    .filter((m) => m.valeur > 0 || m.suivi)
    .sort((a, b) => Number(b.suivi) - Number(a.suivi));

  return (
    <Card>
      <AppText variant="surTitre">{t('nutrition.micros.titre')}</AppText>
      {cles.length === 0 ? <AppText variant="secondaire">{t('nutrition.micros.vide')}</AppText> : null}
      {cles.map((m) => (
        <View key={m.cle} style={styles.ligne}>
          <View style={styles.nom}>
            <AppText variant="secondaire">{t(`nutrition.micros.noms.${m.cle}`)}</AppText>
            {m.suivi ? <AppText variant="libelle" color={colors.accent}>{t('nutrition.micros.suivi')}</AppText> : null}
          </View>
          <AppText variant="corpsGras">{t('nutrition.valeurUnite', { valeur: formatQuantite(m.valeur), unite: MICROS[m.cle].unite })}</AppText>
        </View>
      ))}
      <AppText variant="libelle">{t('nutrition.micros.aide')}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', gap: spacing.s },
  nom: { flex: 1, gap: spacing.xxs },
});

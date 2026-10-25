import { Flag, Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, sizes, spacing } from '@/theme/tokens';

import { formatDateJour, formatValeur } from '../format';
import type { RecordJalon } from '../types';

type Props = {
  record: RecordJalon;
  /** Chiffre en très grand (vue d'ensemble) ou en grand (liste). */
  grand?: boolean;
};

/** Un record ou un jalon : fait réel, daté, avec la valeur précédente s'il y en a une. Aucun compliment. */
export function ContenuRecord({ record, grand }: Props) {
  const { t } = useTranslation();
  const Icone = record.nature === 'record' ? Trophy : Flag;
  return (
    <View style={styles.bloc}>
      <View style={styles.ligne}>
        <Icone color={colors.accent} size={sizes.iconePetite} />
        <AppText variant="libelle">
          {t('progres.records.natureDate', { nature: t(`progres.records.${record.nature}`), date: formatDateJour(record.date) })}
        </AppText>
      </View>
      <AppText variant="corpsGras">{record.titre}</AppText>
      {record.valeur !== null ? (
        <AppText variant={grand ? 'chiffreXL' : 'chiffre'} maxFontSizeMultiplier={1.3}>
          {formatValeur(record.valeur, record.unite)}
        </AppText>
      ) : null}
      {record.precedent ? (
        <AppText variant="secondaire">
          {t('progres.records.precedent', {
            valeur: formatValeur(record.precedent.valeur, record.unite),
            date: formatDateJour(record.precedent.date),
          })}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
});

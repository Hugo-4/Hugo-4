import { CircleCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { DetailSeanceProgramme } from '../types';

/** Séance faite : ce qui a été réalisé (durée, RPE, taux de réalisation), tel que renvoyé par le serveur. */
export function RealisationCarte({ realisation }: { realisation: NonNullable<DetailSeanceProgramme['realisation']> }) {
  const { t } = useTranslation();
  const chiffres = [
    realisation.duree_min ? t('programme.seance.duree', { minutes: realisation.duree_min }) : null,
    realisation.rpe ? t('programme.seance.rpe', { rpe: formatNombre(realisation.rpe, Number.isInteger(realisation.rpe) ? 0 : 1) }) : null,
    realisation.taux_completion !== null ? t('programme.seance.completion', { valeur: formatNombre(realisation.taux_completion) }) : null,
  ].filter(Boolean);
  return (
    <Card>
      <View style={styles.ligne}>
        <CircleCheck color={colors.accent} size={sizes.icone} />
        <AppText variant="sousTitre" accessibilityRole="header">
          {t('programme.seance.realiseeTitre')}
        </AppText>
      </View>
      {chiffres.length ? <AppText variant="corpsGras">{chiffres.join(' · ')}</AppText> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
});

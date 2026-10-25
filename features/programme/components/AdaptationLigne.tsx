import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { formatHorodatage } from '@/lib/format';
import { colors, spacing } from '@/theme/tokens';

import { libelleCategorie, libellePortee, libelleStatutAdaptation } from '../presentation';
import type { Adaptation } from '../types';

/** Une adaptation : date, cause (traduite), raison (texte du serveur), portée, statut, qui l'a demandée. */
export function AdaptationLigne({ adaptation }: { adaptation: Adaptation }) {
  const { t } = useTranslation();
  const declencheur = ['athlete', 'agent', 'checkin'].includes(adaptation.declencheur)
    ? t(`programme.adaptations.declencheurs.${adaptation.declencheur as 'athlete' | 'agent' | 'checkin'}`)
    : null;
  const nbSeances = adaptation.seances_modifiees?.length ?? 0;
  const details = [
    libellePortee(adaptation.portee),
    nbSeances ? t('programme.adaptations.seances', { count: nbSeances }) : null,
    declencheur,
  ].filter(Boolean);
  const statut = libelleStatutAdaptation(adaptation.statut);

  return (
    <Card>
      <View style={styles.entete}>
        <AppText variant="libelle" style={styles.date}>
          {formatHorodatage(adaptation.created_at)}
        </AppText>
        <AppText variant="libelle" color={adaptation.statut === 'proposee' ? colors.alerte : colors.texte2}>
          {statut}
        </AppText>
      </View>
      <AppText variant="corpsGras">{libelleCategorie(adaptation.categorie)}</AppText>
      {adaptation.raison ? <AppText variant="corps">{adaptation.raison}</AppText> : null}
      <AppText variant="secondaire">{details.join(' · ')}</AppText>
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  date: { flex: 1 },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { formatHorodatage } from '@/lib/format';
import { colors, spacing } from '@/theme/tokens';

import { causeSante, libelleCategorie, libellePortee, libelleStatutAdaptation } from '../presentation';
import type { Adaptation } from '../types';
import { ReponseProposition } from './ReponseProposition';

type Props = {
  adaptation: Adaptation;
  /** Consentement « données de santé » donné : sinon douleur, blessure et maladie (et leur raison) sont masquées. */
  santeAutorisee: boolean;
};

/**
 * Une adaptation : date, cause (traduite), raison (texte du serveur), portée, statut, qui l'a demandée.
 * Proposée par le coach : on peut y répondre ici (accepter ou garder son programme).
 */
export function AdaptationLigne({ adaptation, santeAutorisee }: Props) {
  const { t } = useTranslation();
  const masquee = !santeAutorisee && causeSante(adaptation.categorie);
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
      <AppText variant="corpsGras">{masquee ? t('programme.adaptations.santeMasquee') : libelleCategorie(adaptation.categorie)}</AppText>
      {masquee ? <AppText variant="secondaire">{t('programme.adaptations.santeMasqueeAide')}</AppText> : null}
      {adaptation.raison && !masquee ? <AppText variant="corps">{adaptation.raison}</AppText> : null}
      <AppText variant="secondaire">{details.join(' · ')}</AppText>
      {adaptation.statut === 'proposee' ? <ReponseProposition adaptationId={adaptation.id} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  date: { flex: 1 },
});

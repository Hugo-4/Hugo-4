import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { libelleType } from '@/features/accueil/presentation';
import { formatNombre } from '@/lib/format';
import { colors, spacing } from '@/theme/tokens';

import { libelleIntensite, libellePhase, libelleStatutSeance, majuscule, nomLieu } from '../presentation';
import type { DetailSeanceProgramme, Legende } from '../types';
import { IntensiteTraits } from './IntensiteTraits';

type Props = { detail: DetailSeanceProgramme; legende?: Legende };

/** En-tête de la séance : bloc, titre, durée · RPE cible · heure · lieu, intensité, statut et adaptation éventuelle. */
export function SeanceResume({ detail, legende }: Props) {
  const { t } = useTranslation();
  const { seance } = detail;
  const rpe = seance.intensite.rpe_cible;
  const duree = seance.duree_min ?? detail.duree_estimee_min ?? null;
  const infos = [
    libelleType(seance.type),
    duree ? t('programme.seance.duree', { minutes: duree }) : null,
    rpe ? t('programme.seance.rpe', { rpe: formatNombre(rpe, Number.isInteger(rpe) ? 0 : 1) }) : null,
    seance.heure,
    nomLieu(detail.lieu),
  ].filter(Boolean);
  const intensite = t('programme.intensite.a11y', {
    niveau: seance.intensite.niveau,
    libelle: libelleIntensite(seance.intensite.niveau, legende),
  });
  const statutVisible = !['a_venir', 'prete'].includes(seance.statut.code);

  return (
    <Card>
      {detail.bloc ? (
        <AppText variant="surTitre">{t('programme.seance.bloc', { bloc: detail.bloc.nom, phase: libellePhase(detail.bloc.phase) })}</AppText>
      ) : null}
      <View style={styles.titre}>
        <AppText variant="titre" accessibilityRole="header">
          {detail.nom ?? seance.titre}
        </AppText>
        <AppText variant="secondaire">{infos.join(' · ')}</AppText>
      </View>
      <View style={styles.intensite} accessible accessibilityLabel={intensite}>
        <IntensiteTraits niveau={seance.intensite.niveau} />
        <AppText variant="libelle" color={colors.texte2}>
          {intensite}
        </AppText>
      </View>
      {statutVisible ? (
        <AppText variant="corpsGras" color={seance.statut.code === 'manquee' ? colors.alerte : colors.accent}>
          {majuscule(libelleStatutSeance(seance.statut))}
        </AppText>
      ) : null}
      {detail.adaptation?.raison ? (
        <AppText variant="secondaire" color={colors.alerte}>
          {t('programme.seance.adaptee', { raison: detail.adaptation.raison })}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  titre: { gap: spacing.xs },
  intensite: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
});

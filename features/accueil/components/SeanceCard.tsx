import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { colors, spacing } from '@/theme/tokens';

import { exercicesTravail, libelleType } from '../presentation';
import type { Accueil, SeanceDuJour } from '../types';
import { ExerciceLigne } from './ExerciceLigne';

type Props = {
  seance: SeanceDuJour;
  bloc: Accueil['bloc'];
  onDemarrer: () => void;
  onModifier: () => void;
};

const EXERCICES_VISIBLES = 3;

export function SeanceCard({ seance, bloc, onDemarrer, onModifier }: Props) {
  const { t } = useTranslation();
  const exercices = exercicesTravail(seance.detail);
  const restants = exercices.length - Math.min(exercices.length, EXERCICES_VISIBLES);
  const details = [
    libelleType(seance.type),
    seance.duree_min ? t('accueil.seance.duree', { minutes: seance.duree_min }) : null,
    seance.intensite.rpe_cible ? t('accueil.seance.rpeCible', { rpe: formatNombre(seance.intensite.rpe_cible, Number.isInteger(seance.intensite.rpe_cible) ? 0 : 1) }) : null,
    exercices.length ? t('accueil.seance.exercices', { count: exercices.length }) : null,
    seance.heure,
  ].filter(Boolean);

  return (
    <Card>
      {bloc ? (
        <AppText variant="surTitre">
          {bloc.semaine && bloc.nb_semaines
            ? t('accueil.seance.blocSemaine', { bloc: bloc.nom, semaine: bloc.semaine, total: bloc.nb_semaines })
            : bloc.nom}
        </AppText>
      ) : null}
      <View style={styles.titre}>
        <AppText variant="titre">{seance.titre}</AppText>
        <AppText variant="secondaire">{details.join(' · ')}</AppText>
        {seance.modification ? (
          <AppText variant="secondaire" color={colors.alerte}>
            {t('accueil.seance.adaptee', { raison: seance.modification.raison })}
          </AppText>
        ) : null}
      </View>
      <View style={styles.exercices}>
        {exercices.slice(0, EXERCICES_VISIBLES).map((exercice) => (
          <ExerciceLigne key={`${exercice.ordre}-${exercice.exercice.slug}`} exercice={exercice} />
        ))}
        {restants > 0 ? (
          <AppText variant="libelle">{t('accueil.seance.plusExercices', { count: restants })}</AppText>
        ) : null}
        {!seance.detail || seance.detail.en_preparation ? (
          <AppText variant="libelle">{t('accueil.seance.enPreparation')}</AppText>
        ) : null}
      </View>
      <Button label={t('accueil.seance.demarrer')} onPress={onDemarrer} />
      <Button label={t('accueil.seance.modifier')} variant="secondaire" onPress={onModifier} />
    </Card>
  );
}

const styles = StyleSheet.create({
  titre: { gap: spacing.xs },
  exercices: { gap: spacing.s },
});

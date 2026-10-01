import { Flame } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { SeanceDuJour } from '../types';
import { ExerciceLigne } from './ExerciceLigne';

type Props = {
  seance: SeanceDuJour;
  onDemarrer: () => void;
  onModifier: () => void;
};

const EXERCICES_VISIBLES = 3;

export function SeanceCard({ seance, onDemarrer, onModifier }: Props) {
  const { t } = useTranslation();
  const restants = seance.nombreExercices - Math.min(seance.exercices.length, EXERCICES_VISIBLES);
  const details = [
    t('accueil.seance.duree', { minutes: seance.dureeMinutes }),
    t('accueil.seance.rpeCible', { rpe: seance.rpeCible }),
    t('accueil.seance.exercices', { count: seance.nombreExercices }),
    seance.lieu,
  ].join(' · ');

  return (
    <Card>
      <View style={styles.entete}>
        <AppText variant="surTitre" style={styles.bloc}>
          {t('accueil.seance.blocSemaine', {
            bloc: seance.bloc,
            semaine: seance.semaine,
            total: seance.semainesTotal,
          })}
        </AppText>
        <View
          style={styles.serie}
          accessible
          accessibilityLabel={t('accueil.seance.a11ySerie', { count: seance.serieSemaines })}>
          <Flame color={colors.alerte} size={sizes.iconePetite} />
          <AppText variant="libelle" color={colors.alerte}>
            {t('accueil.seance.serie', { count: seance.serieSemaines })}
          </AppText>
        </View>
      </View>
      <View style={styles.titre}>
        <AppText variant="titre">{seance.titre}</AppText>
        <AppText variant="secondaire">{details}</AppText>
      </View>
      <View style={styles.exercices}>
        {seance.exercices.slice(0, EXERCICES_VISIBLES).map((exercice) => (
          <ExerciceLigne key={exercice.nom} exercice={exercice} />
        ))}
        {restants > 0 ? (
          <AppText variant="libelle">{t('accueil.seance.plusExercices', { count: restants })}</AppText>
        ) : null}
      </View>
      <Button label={t('accueil.seance.demarrer')} onPress={onDemarrer} />
      <Button label={t('accueil.seance.modifier')} variant="secondaire" onPress={onModifier} />
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.s },
  bloc: { flexShrink: 1 },
  serie: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  titre: { gap: spacing.xs },
  exercices: { gap: spacing.s },
});

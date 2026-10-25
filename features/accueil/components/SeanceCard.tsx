import { CheckCircle2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import { exercicesTravail, libelleType } from '../presentation';
import type { Accueil, SeanceDuJour } from '../types';
import { ExerciceLigne } from './ExerciceLigne';

type Props = {
  seance: SeanceDuJour;
  bloc: Accueil['bloc'];
  /** Séance commencée puis quittée : le bouton devient « Reprendre la séance ». */
  enCours: boolean;
  onDemarrer: () => void;
  onModifier: () => void;
  /** Toucher la carte (hors boutons) ouvre le détail de la séance. */
  onOuvrir: () => void;
};

const EXERCICES_VISIBLES = 3;

export function SeanceCard({ seance, bloc, enCours, onDemarrer, onModifier, onOuvrir }: Props) {
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
  const faite = seance.statut.code === 'faite';

  return (
    <Card>
      {bloc ? (
        <AppText variant="surTitre">
          {bloc.semaine && bloc.nb_semaines
            ? t('accueil.seance.blocSemaine', { bloc: bloc.nom, semaine: bloc.semaine, total: bloc.nb_semaines })
            : bloc.nom}
        </AppText>
      ) : null}
      <Pressable
        accessibilityRole="button"
        accessibilityHint={t('accueil.seance.a11yOuvrir')}
        onPress={onOuvrir}
        style={({ pressed }) => [styles.titre, pressed && styles.presse]}>
        <View style={styles.ligneTitre}>
          {faite ? <CheckCircle2 color={colors.accent} size={sizes.icone} /> : null}
          <AppText variant="titre" style={styles.flex}>
            {seance.titre}
          </AppText>
        </View>
        {faite ? (
          <AppText variant="corpsGras" color={colors.accent}>
            {t('accueil.seance.faite')}
          </AppText>
        ) : null}
        <AppText variant="secondaire">{details.join(' · ')}</AppText>
        {seance.modification ? (
          <AppText variant="secondaire" color={colors.alerte}>
            {t('accueil.seance.adaptee', { raison: seance.modification.raison })}
          </AppText>
        ) : null}
      </Pressable>
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
      {faite ? (
        <Button label={t('accueil.seance.voirDetail')} variant="discret" onPress={onOuvrir} />
      ) : (
        <>
          <Button label={t(enCours ? 'accueil.seance.reprendre' : 'accueil.seance.demarrer')} onPress={onDemarrer} />
          <Button label={t('accueil.seance.modifier')} variant="secondaire" onPress={onModifier} />
        </>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  titre: { gap: spacing.xs },
  ligneTitre: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  flex: { flex: 1 },
  presse: { opacity: opacity.presse },
  exercices: { gap: spacing.s },
});

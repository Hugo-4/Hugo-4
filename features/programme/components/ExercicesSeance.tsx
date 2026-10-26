import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { sizes, spacing } from '@/theme/tokens';

import type { DetailSeanceProgramme } from '../types';
import { ExerciceBouton } from './ExerciceBouton';

type Props = {
  detail: DetailSeanceProgramme;
  onExercice: (slug: string) => void;
  onReessayer: () => void;
};

/** Exercices par bloc (ou structure d'endurance) ; aperçu en préparation : squelette, nouvel essai automatique. */
export function ExercicesSeance({ detail, onExercice, onReessayer }: Props) {
  const { t } = useTranslation();

  if (detail.en_preparation) {
    return (
      <Card accessibilityLiveRegion="polite">
        <AppText variant="secondaire">{t('programme.seance.enPreparation')}</AppText>
        <Skeleton hauteur={sizes.pasAPas} />
        <Skeleton hauteur={sizes.pasAPas} />
        <Skeleton hauteur={sizes.pasAPas} />
      </Card>
    );
  }

  const blocs = detail.exercices?.blocs.filter((b) => b.exercices.length) ?? [];
  const endurance = detail.endurance?.elements ?? [];
  if (!blocs.length && !endurance.length) {
    return (
      <Card>
        <AppText variant="secondaire">{t(detail.indisponible ? 'programme.seance.indisponible' : 'programme.seance.sansExercices')}</AppText>
        {detail.indisponible ? <Button label={t('commun.reessayer')} variant="secondaire" onPress={onReessayer} /> : null}
      </Card>
    );
  }

  return (
    <View style={styles.bloc}>
      {blocs.map((b) => (
        <Card key={b.bloc}>
          <AppText variant="surTitre" accessibilityRole="header">
            {b.libelle}
          </AppText>
          {b.exercices.map((e) => (
            <ExerciceBouton key={`${e.ordre}-${e.exercice.slug}`} exercice={e} onPress={onExercice} />
          ))}
        </Card>
      ))}
      {endurance.length ? (
        <Card>
          <AppText variant="surTitre" accessibilityRole="header">
            {t('programme.seance.structure')}
          </AppText>
          {endurance.map((e) => (
            <View key={e.ordre} style={styles.element}>
              <AppText variant="libelle">{e.bloc_libelle}</AppText>
              <AppText variant="corpsGras">{e.texte}</AppText>
              {e.consigne ? <AppText variant="secondaire">{e.consigne}</AppText> : null}
            </View>
          ))}
        </Card>
      ) : null}
      {detail.note ? <AppText variant="libelle">{detail.note}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.entreCartes },
  element: { gap: spacing.xxs },
});

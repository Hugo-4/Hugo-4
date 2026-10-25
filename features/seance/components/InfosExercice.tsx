import { Ellipsis } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { formatNombre } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { SerieRealisee, SerieSuivante, ExerciceSeance } from '../types';

type Props = {
  exercice: ExerciceSeance;
  numeroSerie: number;
  totalSeries: number;
  precedente: SerieRealisee | null;
  suggestion: SerieSuivante | null;
  onFiche: () => void;
  onMenu: () => void;
};

/** Nom (ouvre la fiche), « Série 2 / 4 », consigne du serveur, série précédente et charge conseillée. */
export function InfosExercice({ exercice, numeroSerie, totalSeries, precedente, suggestion, onFiche, onMenu }: Props) {
  const { t } = useTranslation();
  const consignes = [
    exercice.rir_cible !== null ? t('enSeance.rirCible', { rir: exercice.rir_cible }) : null,
    exercice.tempo ? t('enSeance.tempo', { tempo: exercice.tempo }) : null,
    exercice.consigne,
  ].filter(Boolean);

  return (
    <View style={styles.bloc}>
      <View style={styles.ligne}>
        <Pressable
          accessibilityRole="button"
          accessibilityHint={t('enSeance.a11yFiche')}
          onPress={onFiche}
          style={styles.nom}>
          <AppText variant="titre">{exercice.exercice.nom}</AppText>
        </Pressable>
        <IconButton accessibilityLabel={t('enSeance.menu.titre')} onPress={onMenu}>
          <Ellipsis color={colors.texte} size={sizes.icone} />
        </IconButton>
      </View>
      <AppText variant="surTitre" color={colors.accent}>
        {t('enSeance.serie', { numero: numeroSerie, total: totalSeries })}
      </AppText>
      {consignes.length ? <AppText variant="secondaire">{consignes.join(' · ')}</AppText> : null}
      {precedente ? (
        <AppText variant="libelle">
          {t('enSeance.precedente', {
            detail: [
              precedente.charge_kg !== null ? t('enSeance.kg', { valeur: formatNombre(precedente.charge_kg, 1) }) : null,
              precedente.reps !== null ? t('enSeance.foisReps', { reps: precedente.reps }) : null,
              precedente.duree_sec ? t('enSeance.secondes', { valeur: precedente.duree_sec }) : null,
              precedente.rpe !== null ? t('enSeance.a11yRpe', { rpe: precedente.rpe }) : null,
            ]
              .filter(Boolean)
              .join(' · '),
          })}
        </AppText>
      ) : null}
      {suggestion?.charge_kg ? (
        <AppText variant="secondaire" color={colors.accent}>
          {t('enSeance.conseillee', { charge: formatNombre(suggestion.charge_kg, 1), raison: suggestion.message })}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  ligne: { flexDirection: 'row', alignItems: 'flex-start', gap: spacing.m },
  nom: { flex: 1, minHeight: sizes.cibleTactile, justifyContent: 'center' },
});

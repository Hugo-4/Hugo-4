import { X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { ProgressBar } from '@/components/ProgressBar';
import { colors, sizes, spacing } from '@/theme/tokens';

import { exercicesDe, statutExercice } from '../etat';
import { formatChrono, useMaintenant } from '../useMinuterie';
import { useSeance } from '../SeanceProvider';

/** Quitter, titre, « Exercice 2 / 6 · 18:24 » et barre de progression. */
export function EnteteSeance({ onQuitter }: { onQuitter: () => void }) {
  const { t } = useTranslation();
  const { etat } = useSeance();
  const maintenant = useMaintenant();
  const exercices = exercicesDe(etat.seance);
  const termines = exercices.filter((e, i) => ['fait', 'passe', 'arrete'].includes(statutExercice(etat, e, i))).length;
  const chrono = formatChrono((maintenant - etat.debut) / 1000);

  return (
    <View style={styles.entete}>
      <View style={styles.ligne}>
        <IconButton accessibilityLabel={t('enSeance.quitter')} onPress={onQuitter}>
          <X color={colors.texte} size={sizes.icone} />
        </IconButton>
        <View style={styles.titre}>
          <AppText variant="sousTitre" numberOfLines={1} accessibilityRole="header">
            {etat.seance.nom}
          </AppText>
          <AppText variant="secondaire">
            {t('enSeance.position', { numero: Math.min(etat.index + 1, exercices.length), total: exercices.length, chrono })}
          </AppText>
        </View>
      </View>
      <ProgressBar
        progression={exercices.length ? termines / exercices.length : 0}
        accessibilityLabel={t('enSeance.a11yProgression', { faits: termines, total: exercices.length })}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  entete: { gap: spacing.m, paddingHorizontal: spacing.ecran, paddingTop: spacing.s },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  titre: { flex: 1, gap: spacing.xxs },
});

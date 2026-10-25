import { Check, CircleDot, Circle, Ban } from 'lucide-react-native';
import { Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { prescription } from '@/features/accueil/presentation';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { cleExercice, exercicesDe, type StatutExercice, statutExercice } from '../etat';
import { useSeance } from '../SeanceProvider';

const icones: Record<StatutExercice, { Icone: typeof Check; couleur: string }> = {
  fait: { Icone: Check, couleur: colors.accent },
  en_cours: { Icone: CircleDot, couleur: colors.accent },
  a_faire: { Icone: Circle, couleur: colors.discret },
  passe: { Icone: Ban, couleur: colors.discret },
  arrete: { Icone: Ban, couleur: colors.alerte },
};

/** Toute la séance : chaque exercice, sa prescription et son état ; toucher l'ouvre en vue exercice. */
export function VueListe({ onOuvrir }: { onOuvrir: (index: number) => void }) {
  const { t } = useTranslation();
  const { etat } = useSeance();

  return (
    <ScrollView contentContainerStyle={styles.contenu}>
      {exercicesDe(etat.seance).map((exercice, index) => {
        const statut = statutExercice(etat, exercice, index);
        const { Icone, couleur } = icones[statut];
        const faites = etat.series[cleExercice(exercice)]?.length ?? 0;
        return (
          <Pressable
            key={cleExercice(exercice)}
            accessibilityRole="button"
            accessibilityLabel={t('enSeance.a11yLigne', {
              nom: exercice.exercice.nom,
              statut: t(`enSeance.statutCourt.${statut}`),
            })}
            onPress={() => onOuvrir(index)}
            style={({ pressed }) => [styles.ligne, index === etat.index && styles.active, pressed && styles.presse]}>
            <Icone color={couleur} size={sizes.icone} />
            <View style={styles.texte}>
              <AppText variant="corpsGras">{exercice.exercice.nom}</AppText>
              <AppText variant="secondaire">{prescription(exercice)}</AppText>
            </View>
            {faites ? <AppText variant="libelle">{t('enSeance.seriesFaites', { count: faites })}</AppText> : null}
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.s },
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: sizes.pasAPas,
    padding: spacing.m,
    borderRadius: radius.petit,
    backgroundColor: colors.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
  },
  active: { borderColor: colors.accent },
  texte: { flex: 1, gap: spacing.xxs },
  presse: { opacity: opacity.presse },
});

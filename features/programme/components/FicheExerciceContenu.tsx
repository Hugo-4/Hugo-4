import { Image, ScrollView, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

import { enListe } from '../presentation';
import type { FicheExercice } from '../types';
import { SectionListe } from './SectionListe';

/** Image en 16/9 au-dessus de la fiche. */
const FORMAT_IMAGE = 16 / 9;

/** Fiche technique : image, muscles, consignes clés, étapes, conseils, erreurs fréquentes (vidéo : plus tard). */
export function FicheExerciceContenu({ fiche }: { fiche: FicheExercice }) {
  const { t } = useTranslation();
  const muscles = enListe(fiche.groupes_musculaires_primaires);
  const sections = [
    { cle: 'consignes', titre: t('programme.exercice.consignes'), lignes: enListe(fiche.consignes_cles) },
    { cle: 'etapes', titre: t('programme.exercice.etapes'), lignes: enListe(fiche.etapes), numerotee: true },
    { cle: 'conseils', titre: t('programme.exercice.conseils'), lignes: enListe(fiche.conseils_execution) },
    { cle: 'erreurs', titre: t('programme.exercice.erreurs'), lignes: enListe(fiche.erreurs_communes) },
  ];
  const vide = !muscles.length && sections.every((s) => !s.lignes.length);

  return (
    <ScrollView contentContainerStyle={styles.contenu}>
      {fiche.image_url ? (
        <Image
          source={{ uri: fiche.image_url }}
          style={styles.image}
          resizeMode="cover"
          accessibilityRole="image"
          accessibilityLabel={t('programme.exercice.a11yImage', { nom: fiche.nom })}
        />
      ) : null}
      {muscles.length ? (
        <AppText variant="secondaire">{t('programme.exercice.muscles', { liste: muscles.join(', ') })}</AppText>
      ) : null}
      {sections.map((s) => (
        <SectionListe key={s.cle} titre={s.titre} lignes={s.lignes} numerotee={s.numerotee} />
      ))}
      {vide ? <AppText variant="secondaire">{t('programme.exercice.vide')}</AppText> : null}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.xl },
  image: { width: '100%', aspectRatio: FORMAT_IMAGE, borderRadius: radius.petit, backgroundColor: colors.carte2 },
});

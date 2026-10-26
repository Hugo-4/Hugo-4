import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Feuille } from '@/components/Feuille';
import { spacing } from '@/theme/tokens';

import type { ExerciceSeance } from '../types';

type Props = { exercice: ExerciceSeance | null; onFermer: () => void };

/** Fiche technique en feuille : la séance continue derrière. Textes fournis par le serveur. */
export function FicheExercice({ exercice, onFermer }: Props) {
  const { t } = useTranslation();
  const fiche = exercice?.exercice;
  return (
    <Feuille visible={exercice !== null} titre={fiche?.nom ?? ''} onFermer={onFermer}>
      {fiche?.muscles.length ? (
        <View style={styles.groupe}>
          <AppText variant="surTitre">{t('enSeance.fiche.muscles')}</AppText>
          <AppText variant="corps">{fiche.muscles.join(', ')}</AppText>
        </View>
      ) : null}
      {fiche?.consignes.length ? (
        <View style={styles.groupe}>
          <AppText variant="surTitre">{t('enSeance.fiche.consignes')}</AppText>
          {fiche.consignes.map((consigne) => (
            <AppText key={consigne} variant="corps">
              {`• ${consigne}`}
            </AppText>
          ))}
        </View>
      ) : null}
      {!fiche?.muscles.length && !fiche?.consignes.length ? (
        <AppText variant="secondaire">{t('enSeance.fiche.vide')}</AppText>
      ) : null}
      {fiche ? (
        <Button
          label={t('enSeance.fiche.complete')}
          variant="discret"
          onPress={() => {
            // La fiche complète du catalogue s'ouvre en feuille par-dessus la séance (elle demande le réseau).
            onFermer();
            router.push({ pathname: '/exercice/[slug]', params: { slug: fiche.slug } });
          }}
        />
      ) : null}
    </Feuille>
  );
}

const styles = StyleSheet.create({
  groupe: { gap: spacing.s },
});

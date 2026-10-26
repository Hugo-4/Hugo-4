import { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors, radius, spacing } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { useSeance } from '../SeanceProvider';
import { formatChrono, useRepos } from '../useMinuterie';

const PAS_S = 15;

/** Repos entre deux séries : démarre seul à la validation, −15 s / +15 s / Passer. */
export function MinuteurRepos() {
  const { t } = useTranslation();
  const { etat, dispatch } = useSeance();
  const finir = useCallback(() => dispatch({ type: 'repos', delta: 'passer' }), [dispatch]);
  const restant = useRepos(etat.repos?.fin ?? null, finir);
  if (restant === null) return null;

  return (
    <View style={styles.carte} accessibilityLiveRegion="polite">
      <AppText variant="surTitre">{t('enSeance.repos.titre')}</AppText>
      <AppText
        variant="display"
        color={colors.accent}
        maxFontSizeMultiplier={multiplicateurMax}
        accessibilityLabel={t('enSeance.repos.a11yRestant', { secondes: restant })}>
        {formatChrono(restant)}
      </AppText>
      <View style={styles.boutons}>
        <Button
          label={t('enSeance.repos.moins', { s: PAS_S })}
          variant="secondaire"
          onPress={() => dispatch({ type: 'repos', delta: -PAS_S })}
          style={styles.bouton}
        />
        <Button
          label={t('enSeance.repos.plus', { s: PAS_S })}
          variant="secondaire"
          onPress={() => dispatch({ type: 'repos', delta: PAS_S })}
          style={styles.bouton}
        />
        <Button label={t('enSeance.repos.passer')} variant="secondaire" onPress={finir} style={styles.bouton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    alignItems: 'center',
    gap: spacing.s,
    padding: spacing.carte,
    borderRadius: radius.carte,
    backgroundColor: colors.carte2,
  },
  boutons: { flexDirection: 'row', gap: spacing.s, alignSelf: 'stretch' },
  bouton: { flex: 1, paddingHorizontal: spacing.s },
});

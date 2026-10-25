import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';

import type { BlocProgramme } from '../types';
import { BlocCarte, LARGEUR_BLOC } from './BlocCarte';

const LARGEUR_ET_ECART = LARGEUR_BLOC + spacing.m;

/** Frise des blocs du programme, en défilement horizontal, ouverte sur le bloc en cours. */
export function FriseBlocs({ blocs }: { blocs: BlocProgramme[] }) {
  const { t } = useTranslation();
  if (!blocs.length) return null;
  const indexEnCours = Math.max(0, blocs.findIndex((b) => b.statut === 'en_cours'));
  return (
    <View style={styles.bloc}>
      <AppText variant="surTitre" accessibilityRole="header">
        {t('programme.blocs.titre')}
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentOffset={{ x: indexEnCours * LARGEUR_ET_ECART, y: 0 }}
        contentContainerStyle={styles.frise}
        style={styles.debordement}>
        {blocs.map((b) => (
          <BlocCarte key={b.id} bloc={b} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  // La frise va jusqu'aux bords de l'écran, le contenu reste aligné sur la marge.
  debordement: { marginHorizontal: -spacing.ecran },
  frise: { gap: spacing.m, paddingHorizontal: spacing.ecran },
});

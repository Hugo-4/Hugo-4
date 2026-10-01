import { StyleSheet } from 'react-native';

import { colors, fonts, fontSizes } from '@/theme/tokens';

import { AppText } from './AppText';

/** Logo texte ATHLENIS (nom de marque, identique dans toutes les langues). */
export function Logo() {
  return (
    <AppText style={styles.logo} accessibilityRole="header">
      ATHLENIS
    </AppText>
  );
}

const styles = StyleSheet.create({
  logo: {
    fontFamily: fonts.titreGras,
    fontSize: fontSizes.xxl,
    color: colors.accent,
    letterSpacing: 4,
  },
});

import type { TextStyle } from 'react-native';

import { colors, fonts, fontSizes } from './tokens';

/** Styles de texte nommés, utilisés par le composant AppText. */
export const typography = {
  display: { fontFamily: fonts.titreGras, fontSize: fontSizes.display, color: colors.texte },
  titre: { fontFamily: fonts.titreGras, fontSize: fontSizes.xxl, color: colors.texte },
  sousTitre: { fontFamily: fonts.titre, fontSize: fontSizes.xl, color: colors.texte },
  chiffre: { fontFamily: fonts.titreGras, fontSize: fontSizes.xl, color: colors.texte },
  surTitre: {
    fontFamily: fonts.titre,
    fontSize: fontSizes.s,
    color: colors.discret,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  corps: { fontFamily: fonts.texte, fontSize: fontSizes.m, color: colors.texte },
  corpsGras: { fontFamily: fonts.texteDemiGras, fontSize: fontSizes.m, color: colors.texte },
  secondaire: { fontFamily: fonts.texteMoyen, fontSize: fontSizes.s, color: colors.texte2 },
  libelle: { fontFamily: fonts.texteMoyen, fontSize: fontSizes.xs, color: colors.discret },
  bouton: { fontFamily: fonts.titreGras, fontSize: fontSizes.l, letterSpacing: 0.5 },
} satisfies Record<string, TextStyle>;

export type TypographyVariant = keyof typeof typography;

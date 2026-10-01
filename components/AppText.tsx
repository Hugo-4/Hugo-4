import { Text, type TextProps } from 'react-native';

import { typography, type TypographyVariant } from '@/theme/typography';

type Props = TextProps & {
  variant?: TypographyVariant;
  color?: string;
};

/** Texte de l'app : la police, la taille et la couleur viennent des jetons. */
export function AppText({ variant = 'corps', color, style, ...rest }: Props) {
  return <Text style={[typography[variant], color ? { color } : null, style]} {...rest} />;
}

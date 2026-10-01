import { Eye, EyeOff } from 'lucide-react-native';
import { useState } from 'react';
import { Pressable, StyleSheet, TextInput, type TextInputProps, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, fontSizes, radius, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = Omit<TextInputProps, 'style' | 'secureTextEntry'> & {
  label: string;
  erreur?: string;
  aide?: string;
  motDePasse?: boolean;
};

export function TextField({ label, erreur, aide, motDePasse, ...rest }: Props) {
  const { t } = useTranslation();
  const [masque, setMasque] = useState(true);
  const [focus, setFocus] = useState(false);
  const couleurBordure = erreur ? colors.alerte : focus ? colors.accent : colors.ligne;

  return (
    <View style={styles.bloc}>
      <AppText variant="libelle" color={colors.texte2}>
        {label}
      </AppText>
      <View style={[styles.champ, { borderColor: couleurBordure }]}>
        <TextInput
          accessibilityLabel={label}
          placeholderTextColor={colors.discret}
          selectionColor={colors.accent}
          secureTextEntry={motDePasse && masque}
          onFocus={() => setFocus(true)}
          onBlur={() => setFocus(false)}
          style={styles.saisie}
          {...rest}
        />
        {motDePasse ? (
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={t(masque ? 'auth.champs.afficher' : 'auth.champs.masquer')}
            onPress={() => setMasque((m) => !m)}
            style={styles.oeil}>
            {masque ? (
              <Eye color={colors.discret} size={sizes.icone} />
            ) : (
              <EyeOff color={colors.discret} size={sizes.icone} />
            )}
          </Pressable>
        ) : null}
      </View>
      {erreur ? (
        <AppText variant="libelle" color={colors.alerte} accessibilityLiveRegion="polite">
          {erreur}
        </AppText>
      ) : aide ? (
        <AppText variant="libelle">{aide}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  champ: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    borderWidth: sizes.bordure,
    minHeight: sizes.cibleTactile + spacing.xs,
  },
  saisie: {
    flex: 1,
    color: colors.texte,
    fontFamily: fonts.texte,
    fontSize: fontSizes.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
  },
  oeil: {
    width: sizes.cibleTactile,
    height: sizes.cibleTactile,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

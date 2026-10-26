import { useState } from 'react';
import { StyleSheet, TextInput, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, fonts, fontSizes, radius, sizes, spacing } from '@/theme/tokens';

import { BoutonEnvoyer } from './BoutonEnvoyer';
import { CIBLE } from './dimensions';

/** Même limite que les questions du chat « savoir » du serveur. */
const LONGUEUR_MAX = 1500;
/** Au-delà de trois hauteurs de champ, le texte défile dans le champ. */
const HAUTEUR_MAX = CIBLE * 3;

type Props = {
  /** Renvoie `true` si le message est parti (le champ se vide), `false` sinon (le texte reste). */
  onEnvoyer: (texte: string) => boolean;
  /** Le coach prépare sa réponse : on peut écrire la suite, pas encore l'envoyer. */
  envoiBloque: boolean;
};

/**
 * Champ de message et bouton Envoyer. Pas de dictée : elle demanderait une nouvelle dépendance
 * (reconnaissance vocale) ; le clavier du téléphone a déjà son micro.
 */
export function SaisieMessage({ onEnvoyer, envoiBloque }: Props) {
  const { t } = useTranslation();
  const [texte, setTexte] = useState('');
  const vide = texte.trim().length === 0;

  const envoyer = () => {
    if (onEnvoyer(texte)) setTexte('');
  };

  return (
    <View style={styles.ligne}>
      <TextInput
        value={texte}
        onChangeText={setTexte}
        multiline
        maxLength={LONGUEUR_MAX}
        placeholder={t('coach.saisie.placeholder')}
        placeholderTextColor={colors.discret}
        selectionColor={colors.accent}
        accessibilityLabel={t('coach.saisie.a11yChamp')}
        style={styles.champ}
      />
      <BoutonEnvoyer accessibilityLabel={t('coach.saisie.envoyer')} onPress={envoyer} desactive={vide || envoiBloque} />
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.s, paddingHorizontal: spacing.ecran },
  champ: {
    flex: 1,
    minHeight: CIBLE,
    maxHeight: HAUTEUR_MAX,
    color: colors.texte,
    fontFamily: fonts.texte,
    fontSize: fontSizes.m,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.m,
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
  },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TextField } from '@/components/TextField';
import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { spacing } from '@/theme/tokens';

import type { ChampsLibres } from '../useAjoutAliment';

type Props = { calories: boolean; champs: ChampsLibres; onModifier: (c: Partial<ChampsLibres>) => void; erreurs: { nom: boolean; valeurs: boolean } };

/** Aliment absent de la base : nom, calories et macronutriments de la portion (facultatifs). */
export function FormulaireLibre({ calories, champs, onModifier, erreurs }: Props) {
  const { t } = useTranslation();
  const nombre = (cle: 'calories' | 'proteines' | 'glucides' | 'lipides', libelle: string) => (
    <View style={styles.moitie}>
      <TextField label={libelle} value={champs[cle]} onChangeText={(v) => onModifier({ [cle]: v })} keyboardType="decimal-pad" />
    </View>
  );
  return (
    <View style={styles.bloc}>
      <TextField
        label={t('nutrition.ajout.nom')}
        value={champs.nom}
        onChangeText={(nom) => onModifier({ nom })}
        maxLength={120}
        erreur={erreurs.nom ? t('nutrition.ajout.erreurNom') : undefined}
      />
      <View style={styles.grille}>
        {calories ? nombre('calories', t('nutrition.ajout.caloriesPortion')) : null}
        {nombre('proteines', t('nutrition.ajout.proteinesPortion'))}
        {nombre('glucides', t('nutrition.ajout.glucidesPortion'))}
        {nombre('lipides', t('nutrition.ajout.lipidesPortion'))}
      </View>
      {erreurs.valeurs ? <MessageErreur texte={t('nutrition.ajout.erreurValeurs')} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.m },
  grille: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  moitie: { flexBasis: '45%', flexGrow: 1 },
});

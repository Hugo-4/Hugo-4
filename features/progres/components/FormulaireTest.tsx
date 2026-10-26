import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { Segmente } from '@/components/Segmente';
import { TextField } from '@/components/TextField';
import { messageServeur } from '@/lib/api';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, spacing } from '@/theme/tokens';

import { useFormulaireTest } from '../useFormulaireTest';
import { ChoixTypeTest } from './ChoixTypeTest';

type Props = {
  typeInitial?: string;
  onEnregistre: () => void;
};

/** Contenu de la feuille « Ajouter un résultat » (type, valeur, date, méthode, exercice si besoin, notes). */
export function FormulaireTest({ typeInitial, onEnregistre }: Props) {
  const { t } = useTranslation();
  const enLigne = useEnLigne();
  const { types, typeChoisi, champs, modifier, erreurs, enregistrer, envoi } = useFormulaireTest(typeInitial, onEnregistre);
  const unite = typeChoisi?.unite;

  return (
    <View style={styles.bloc}>
      <ChoixTypeTest types={types} valeur={champs.type} onChange={modifier.setType} erreur={Boolean(erreurs.type)} />
      {typeChoisi?.par_exercice ? (
        <TextField
          label={t('progres.ajout.exercice')}
          placeholder={t('progres.ajout.exercicePlaceholder')}
          value={champs.exercice}
          onChangeText={modifier.setExercice}
          erreur={erreurs.exercice ? t('progres.ajout.erreurs.exercice') : undefined}
        />
      ) : null}
      <TextField
        label={unite ? t('progres.ajout.valeurAvecUnite', { unite }) : t('progres.ajout.valeur')}
        value={champs.valeur}
        onChangeText={modifier.setValeur}
        keyboardType="decimal-pad"
        erreur={erreurs.valeur ? t('progres.ajout.erreurs.valeur') : undefined}
      />
      <DateField
        label={t('progres.ajout.date')}
        valeur={champs.date}
        onChange={modifier.setDate}
        erreur={erreurs.date ? t('progres.ajout.erreurs.date') : undefined}
      />
      <View style={styles.methode}>
        <AppText variant="libelle" color={colors.texte2}>
          {t('progres.ajout.methode')}
        </AppText>
        <Segmente
          options={[
            { valeur: 'teste', label: t('progres.tests.methode.teste') },
            { valeur: 'declare', label: t('progres.tests.methode.declare') },
          ]}
          valeur={champs.methode}
          onChange={modifier.setMethode}
          accessibilityLabel={t('progres.ajout.methode')}
        />
        <AppText variant="libelle">{t('progres.ajout.methodeAide')}</AppText>
      </View>
      <TextField label={t('progres.ajout.notes')} value={champs.notes} onChangeText={modifier.setNotes} multiline />
      {envoi.isError ? (
        <AppText variant="secondaire" color={colors.alerte} accessibilityRole="alert">
          {messageServeur(envoi.error) ?? t('progres.ajout.erreurs.envoi')}
        </AppText>
      ) : null}
      {enLigne ? null : (
        <AppText variant="secondaire" color={colors.alerte} accessibilityRole="alert">
          {t('progres.ajout.horsLigne')}
        </AppText>
      )}
      <Button label={t('progres.ajout.enregistrer')} onPress={enregistrer} disabled={envoi.isPending || !enLigne} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
  methode: { gap: spacing.s },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DateField } from '@/components/DateField';
import { TextField } from '@/components/TextField';
import { spacing } from '@/theme/tokens';

import { dateIso } from '../dates';
import { useInscription } from '../InscriptionProvider';

export function EtapeIdentite() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const { jour, mois, annee } = reponses.naissance;
  const dateComplete = jour.length > 0 && mois.length > 0 && annee.length === 4;

  return (
    <View style={styles.bloc}>
      <TextField
        label={t('inscription.identite.prenom')}
        value={reponses.prenom}
        onChangeText={(prenom) => modifier({ prenom })}
        autoComplete="given-name"
        textContentType="givenName"
        autoCapitalize="words"
      />
      <DateField
        label={t('inscription.identite.naissance')}
        valeur={reponses.naissance}
        onChange={(naissance) => modifier({ naissance })}
        erreur={dateComplete && !dateIso(reponses.naissance) ? t('inscription.erreurs.date') : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
});

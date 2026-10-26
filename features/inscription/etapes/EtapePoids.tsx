import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TextField } from '@/components/TextField';
import { spacing } from '@/theme/tokens';

import { POIDS_MAX, POIDS_MIN, nombreSaisi } from '../etapes';
import { useInscription } from '../InscriptionProvider';

/** Parcours Rapide : le poids, obligatoire (plan nutrition du jour). Une saisie neutre, sans commentaire. */
export function EtapePoids() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const valeur = nombreSaisi(reponses.poidsKg);
  const horsBornes = reponses.poidsKg.trim() !== '' && (valeur === null || valeur < POIDS_MIN || valeur > POIDS_MAX);

  return (
    <View style={styles.bloc}>
      <TextField
        label={t('inscription.physique.poids')}
        aide={t('inscription.physique.poidsAide')}
        value={reponses.poidsKg}
        onChangeText={(poidsKg) => modifier({ poidsKg })}
        keyboardType="decimal-pad"
        erreur={horsBornes ? t('inscription.physique.poidsErreur', { min: POIDS_MIN, max: POIDS_MAX }) : undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { TextField } from '@/components/TextField';
import { colors, spacing } from '@/theme/tokens';

import { SEXES } from '../constantes';
import { useInscription } from '../InscriptionProvider';

export function EtapeProfilPhysique() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();

  return (
    <View style={styles.bloc}>
      <View style={styles.groupe}>
        <AppText variant="libelle" color={colors.texte2}>
          {t('inscription.physique.sexe')}
        </AppText>
        <View style={styles.ligne} accessibilityRole="radiogroup">
          {SEXES.map((sexe) => (
            <Chip
              key={sexe}
              role="radio"
              label={t(`inscription.physique.sexes.${sexe}`)}
              selectionne={reponses.sexe === sexe}
              onPress={() => modifier({ sexe })}
            />
          ))}
        </View>
      </View>
      <TextField
        label={t('inscription.physique.taille')}
        value={reponses.tailleCm}
        onChangeText={(tailleCm) => modifier({ tailleCm })}
        keyboardType="number-pad"
      />
      <TextField
        label={t('inscription.physique.poids')}
        value={reponses.poidsKg}
        onChangeText={(poidsKg) => modifier({ poidsKg })}
        keyboardType="decimal-pad"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
  groupe: { gap: spacing.s },
  ligne: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
});

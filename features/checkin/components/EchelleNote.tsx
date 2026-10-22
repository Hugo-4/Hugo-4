import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { colors, spacing } from '@/theme/tokens';

import { type Echelle, NOTES } from '../constantes';

type Props = {
  echelle: Echelle;
  valeur: number | null;
  onChange: (note: number) => void;
};

/** Note de 1 à 10 en un geste, sur deux rangées de 5 (cibles tactiles de 44 pt). */
export function EchelleNote({ echelle, valeur, onChange }: Props) {
  const { t } = useTranslation();
  const titre = t(`checkin.echelles.${echelle}.titre`);
  return (
    <View style={styles.bloc}>
      <View style={styles.entete}>
        <AppText variant="corpsGras" color={colors.texte2}>
          {titre}
        </AppText>
        {valeur !== null ? <AppText variant="chiffre">{valeur}</AppText> : null}
      </View>
      <View style={styles.notes} accessibilityRole="radiogroup" accessibilityLabel={titre}>
        {NOTES.map((note) => (
          <View key={note} style={styles.case}>
            <Chip
              role="radio"
              label={String(note)}
              accessibilityLabel={t('checkin.a11yNote', { echelle: titre, note })}
              selectionne={valeur === note}
              onPress={() => onChange(note)}
            />
          </View>
        ))}
      </View>
      <View style={styles.bornes}>
        <AppText variant="libelle">{t(`checkin.echelles.${echelle}.min`)}</AppText>
        <AppText variant="libelle">{t(`checkin.echelles.${echelle}.max`)}</AppText>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline' },
  notes: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  case: { flexBasis: '17%', flexGrow: 1 },
  bornes: { flexDirection: 'row', justifyContent: 'space-between' },
});

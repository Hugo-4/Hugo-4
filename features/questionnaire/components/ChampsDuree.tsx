import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TextField } from '@/components/TextField';
import { spacing } from '@/theme/tokens';

import type { ChampsTest } from '../saisie';

type Props = {
  avecHeures: boolean;
  champs: ChampsTest;
  onChange: (changement: Partial<ChampsTest>) => void;
};

/** Durée en heures, minutes et secondes (temps de course, de nage) ou minutes et secondes (allure, gainage). */
export function ChampsDuree({ avecHeures, champs, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.ligne}>
      {avecHeures ? (
        <View style={styles.champ}>
          <TextField
            label={t('questionnaire.test.heures')}
            accessibilityLabel={t('questionnaire.test.a11yHeures')}
            value={champs.heures}
            onChangeText={(heures) => onChange({ heures })}
            keyboardType="number-pad"
            maxLength={2}
          />
        </View>
      ) : null}
      <View style={styles.champ}>
        <TextField
          label={t('questionnaire.test.minutes')}
          accessibilityLabel={t('questionnaire.test.a11yMinutes')}
          value={champs.minutes}
          onChangeText={(minutes) => onChange({ minutes })}
          keyboardType="number-pad"
          maxLength={3}
        />
      </View>
      <View style={styles.champ}>
        <TextField
          label={t('questionnaire.test.secondes')}
          accessibilityLabel={t('questionnaire.test.a11ySecondes')}
          value={champs.secondes}
          onChangeText={(secondes) => onChange({ secondes })}
          keyboardType="number-pad"
          maxLength={2}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', gap: spacing.s },
  champ: { flex: 1 },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { TextField } from '@/components/TextField';
import { colors, spacing } from '@/theme/tokens';

import { CHAMPS_VIDES, type ChampsTest, reponseTest } from '../saisie';
import { texteUnite } from '../textes';
import type { FormatTest, ReponseTest } from '../types';
import { ChampsDuree } from './ChampsDuree';

const ANCIENNETES = ['moins_3_mois', '3_12_mois', 'plus'] as const;
const METHODES = ['test', 'montre', 'estimation'] as const;
/** Tests longs (semi, marathon) : les heures sont demandées. */
const AVEC_HEURES = ['temps_10km', 'temps_semi', 'temps_marathon', 'temps_5km'];

type Props = {
  test: { format: FormatTest; unite: string; libelle: string };
  onChange: (reponse: ReponseTest | null) => void;
};

/** Valeur connue : la valeur (ou la charge et ses répétitions), quand, et comment elle a été obtenue. */
export function SaisieTest({ test, onChange }: Props) {
  const { t } = useTranslation();
  const [champs, setChamps] = useState<ChampsTest>(CHAMPS_VIDES);
  const modifier = (changement: Partial<ChampsTest>) => {
    const suivant = { ...champs, ...changement };
    setChamps(suivant);
    onChange(reponseTest(test.format, suivant));
  };

  return (
    <View style={styles.bloc}>
      <AppText variant="secondaire">{t(test.format === 'charge' ? 'questionnaire.test.aideCharge' : 'questionnaire.test.aide')}</AppText>
      {test.format === 'duree' || test.format === 'allure' ? (
        <ChampsDuree avecHeures={AVEC_HEURES.includes(test.libelle)} champs={champs} onChange={modifier} />
      ) : (
        <View style={styles.ligne}>
          <View style={styles.flex}>
            <TextField
              label={test.format === 'charge' ? t('questionnaire.test.charge') : `${t('questionnaire.test.valeur')} (${texteUnite(t, test.unite)})`}
              value={champs.valeur}
              onChangeText={(valeur) => modifier({ valeur })}
              keyboardType="decimal-pad"
            />
          </View>
          {test.format === 'charge' ? (
            <View style={styles.flex}>
              <TextField
                label={t('questionnaire.test.repetitions')}
                value={champs.repetitions}
                onChangeText={(repetitions) => modifier({ repetitions })}
                keyboardType="number-pad"
                maxLength={2}
              />
            </View>
          ) : null}
        </View>
      )}
      <View style={styles.groupe}>
        <AppText variant="corpsGras" color={colors.texte2}>
          {t('questionnaire.test.anciennete')}
        </AppText>
        <View style={styles.puces} accessibilityRole="radiogroup">
          {ANCIENNETES.map((a) => (
            <Chip key={a} role="radio" label={t(`questionnaire.test.anciennetes.${a}`)} selectionne={champs.anciennete === a} onPress={() => modifier({ anciennete: a })} />
          ))}
        </View>
      </View>
      <View style={styles.groupe}>
        <AppText variant="corpsGras" color={colors.texte2}>
          {t('questionnaire.test.methode')}
        </AppText>
        <View style={styles.puces} accessibilityRole="radiogroup">
          {METHODES.map((m) => (
            <Chip key={m} role="radio" label={t(`questionnaire.test.methodes.${m}`)} selectionne={champs.methode === m} onPress={() => modifier({ methode: m })} />
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
  ligne: { flexDirection: 'row', gap: spacing.s },
  flex: { flex: 1 },
  groupe: { gap: spacing.s },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

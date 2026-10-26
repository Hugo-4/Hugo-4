import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ChoixOption } from '@/components/ChoixOption';
import { spacing } from '@/theme/tokens';

import { texteOption } from '../textes';

type Props = {
  options: readonly string[];
  multiple: boolean;
  max?: number;
  valeur: string | string[] | null;
  onChange: (valeur: string | string[] | null) => void;
};

/** Choix unique ou multiple. « Aucun » exclut les autres réponses (et inversement). */
export function SaisieChoix({ options, multiple, max, valeur, onChange }: Props) {
  const { t } = useTranslation();
  const choisis = Array.isArray(valeur) ? valeur : valeur ? [valeur] : [];

  const basculer = (code: string) => {
    if (!multiple) return onChange(code);
    if (choisis.includes(code)) {
      const reste = choisis.filter((c) => c !== code);
      return onChange(reste.length ? reste : null);
    }
    if (code === 'aucun') return onChange(['aucun']);
    const sansAucun = choisis.filter((c) => c !== 'aucun');
    if (max && sansAucun.length >= max) return;
    onChange([...sansAucun, code]);
  };

  return (
    <View style={styles.liste} accessibilityRole={multiple ? undefined : 'radiogroup'}>
      {multiple && max ? <AppText variant="libelle">{t('questionnaire.question.choixMax', { max })}</AppText> : null}
      {options.map((code) => (
        <ChoixOption
          key={code}
          titre={texteOption(t, code)}
          role={multiple ? 'checkbox' : 'radio'}
          selectionne={choisis.includes(code)}
          onPress={() => basculer(code)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});

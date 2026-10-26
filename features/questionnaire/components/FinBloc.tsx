import { CheckCircle2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = { onSuivant: (() => void) | null; onRetour: () => void };

/** Fin d'un bloc : tout est enregistré ; bloc suivant ou retour à la liste. */
export function FinBloc({ onSuivant, onRetour }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.ecran}>
      <EmptyState
        icon={<CheckCircle2 color={colors.accent} size={sizes.icone * 2} />}
        titre={onSuivant ? t('questionnaire.fin.titre') : t('questionnaire.fin.toutFini')}
        texte={t('questionnaire.fin.texte')}
      />
      {onSuivant ? <Button label={t('questionnaire.fin.suivant')} onPress={onSuivant} /> : null}
      <Button label={t('questionnaire.fin.retour')} variant={onSuivant ? 'secondaire' : 'principal'} onPress={onRetour} />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, padding: spacing.ecran, gap: spacing.m },
});

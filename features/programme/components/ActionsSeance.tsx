import { CalendarClock, MessageCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  onDeplacer: () => void;
  onCoach: () => void;
  onManquee: () => void;
};

/** [S] Déplacer, [S] Modifier avec le coach, [L] Séance manquée (séance encore à venir). */
export function ActionsSeance({ onDeplacer, onCoach, onManquee }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <Button
        label={t('programme.seance.deplacer')}
        variant="secondaire"
        icon={<CalendarClock color={colors.texte} size={sizes.icone} />}
        onPress={onDeplacer}
      />
      <Button
        label={t('programme.seance.coach')}
        variant="secondaire"
        icon={<MessageCircle color={colors.texte} size={sizes.icone} />}
        onPress={onCoach}
      />
      <Button label={t('programme.seance.manquee')} variant="discret" onPress={onManquee} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

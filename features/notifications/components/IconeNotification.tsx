import { Award, Bell, ClipboardCheck, Flag, MessageCircle, RefreshCw } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';

import { PointBadge } from '@/components/PointBadge';
import { colors, radius, sizes } from '@/theme/tokens';

const ICONES = {
  proposition_coach: MessageCircle,
  adaptation_semaine: RefreshCw,
  rappel_checkin: ClipboardCheck,
  competition_proche: Flag,
  nouveau_record: Award,
} as const;

/** Icône du type de notification ; point orange décoratif si elle n'est pas lue (le texte « Nouveau » porte l'info). */
export function IconeNotification({ type, nonLue }: { type: string; nonLue: boolean }) {
  const Icone = ICONES[type as keyof typeof ICONES] ?? Bell;
  return (
    <View style={styles.pastille}>
      <Icone color={nonLue ? colors.accent : colors.texte2} size={sizes.icone} />
      {nonLue ? <PointBadge /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  pastille: {
    width: sizes.avatar,
    height: sizes.avatar,
    borderRadius: radius.rond,
    backgroundColor: colors.carte2,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

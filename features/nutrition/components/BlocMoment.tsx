import { StyleSheet, View } from 'react-native';

import { AppText } from '@/components/AppText';
import { colors, radius, spacing } from '@/theme/tokens';

type Props = { titre: string; quand?: string; lignes: string[]; idee?: string | null; note?: string | null };

/** Un moment autour de la séance (avant, pendant, après) : textes du serveur, puis ce qui est noté. */
export function BlocMoment({ titre, quand, lignes, idee, note }: Props) {
  return (
    <View style={styles.bloc}>
      <AppText variant="corpsGras">{titre}</AppText>
      {quand ? <AppText variant="libelle">{quand}</AppText> : null}
      {lignes.map((l) => (
        <AppText key={l} variant="secondaire">
          {l}
        </AppText>
      ))}
      {idee ? <AppText variant="secondaire" color={colors.discret}>{idee}</AppText> : null}
      {note ? <AppText variant="libelle" color={colors.accent}>{note}</AppText> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs, backgroundColor: colors.carte2, borderRadius: radius.petit, padding: spacing.m },
});

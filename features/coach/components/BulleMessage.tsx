import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import type { RoleMessage } from '../types';
import { LARGEUR_BULLE } from './dimensions';

type Props = {
  role: RoleMessage;
  texte: string;
  /** Message pas encore confirmé par le serveur. */
  attenuee?: boolean;
};

/** Bulle de message : athlète à droite, coach à gauche (le lecteur d'écran annonce qui parle). */
export function BulleMessage({ role, texte, attenuee }: Props) {
  const { t } = useTranslation();
  const athlete = role === 'athlete';
  return (
    <View
      accessible
      accessibilityLabel={t(athlete ? 'coach.message.a11yAthlete' : 'coach.message.a11yCoach', { texte })}
      style={[styles.bulle, athlete ? styles.athlete : styles.coach, attenuee && styles.attenuee]}>
      <AppText variant="corps" selectable>
        {texte}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bulle: {
    maxWidth: LARGEUR_BULLE,
    paddingVertical: spacing.m,
    paddingHorizontal: spacing.carte,
    borderRadius: radius.bouton,
  },
  athlete: { alignSelf: 'flex-end', backgroundColor: colors.carte2, borderBottomRightRadius: spacing.xs },
  coach: {
    alignSelf: 'flex-start',
    backgroundColor: colors.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    borderBottomLeftRadius: spacing.xs,
  },
  attenuee: { opacity: opacity.presse },
});

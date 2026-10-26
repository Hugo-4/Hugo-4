import { StyleSheet, View } from 'react-native';

import { formatCompteARebours, formatDateEvenement } from '@/lib/format';
import { colors, spacing } from '@/theme/tokens';

import { AppText } from './AppText';

type Props = {
  jours: number;
  /** Date de l'événement (AAAA-MM-JJ), affichée sous le compte à rebours. */
  date: string;
  aujourdhui: string;
  aligner?: 'gauche' | 'droite';
};

/** « dans 4 ans et 7 mois » / « dans 23 semaines » / « J-45 », toujours avec la date en dessous. */
export function CompteARebours({ jours, date, aujourdhui, aligner = 'droite' }: Props) {
  return (
    <View style={[styles.bloc, aligner === 'droite' ? styles.droite : styles.gauche]}>
      <AppText variant="chiffre" color={colors.accent}>
        {formatCompteARebours(jours, date, aujourdhui)}
      </AppText>
      <AppText variant="libelle" color={colors.texte2}>
        {formatDateEvenement(date)}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xxs, flexShrink: 1 },
  droite: { alignItems: 'flex-end' },
  gauche: { alignItems: 'flex-start' },
});

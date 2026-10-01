import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { dateLocale, formatJourCourt, formatJourLong } from '@/lib/format';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import type { JourSemaine, StatutJour } from '../types';

type Props = {
  jour: JourSemaine;
};

const stylePastille: Record<StatutJour, { fond: string; bordure: string; texte: string }> = {
  fait: { fond: colors.accent, bordure: colors.accent, texte: colors.surAccent },
  aujourdhui: { fond: 'transparent', bordure: colors.accent, texte: colors.accent },
  prevu: { fond: 'transparent', bordure: colors.discret, texte: colors.texte2 },
  repos: { fond: colors.carte2, bordure: colors.carte2, texte: colors.discret },
};

export function JourPastille({ jour }: Props) {
  const { t } = useTranslation();
  const date = dateLocale(jour.date);
  const apparence = stylePastille[jour.statut];

  return (
    <View
      style={styles.jour}
      accessible
      accessibilityLabel={t('accueil.semaine.a11yJour', {
        jour: formatJourLong(date),
        type: jour.type,
        statut: t(`accueil.semaine.statut.${jour.statut}`),
      })}>
      <View style={[styles.pastille, { backgroundColor: apparence.fond, borderColor: apparence.bordure }]}>
        <AppText variant="corpsGras" color={apparence.texte} style={styles.initiale}>
          {formatJourCourt(date)}
        </AppText>
      </View>
      <AppText variant="libelle" numberOfLines={1} style={styles.type}>
        {jour.type}
      </AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  jour: { flex: 1, alignItems: 'center', gap: spacing.xs },
  pastille: {
    width: sizes.pastilleJour,
    height: sizes.pastilleJour,
    borderRadius: radius.rond,
    borderWidth: sizes.bordureForte,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initiale: { textTransform: 'uppercase' },
  type: { maxWidth: '100%' },
});

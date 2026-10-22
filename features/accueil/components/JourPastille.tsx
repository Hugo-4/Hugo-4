import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { dateLocale, formatJourCourt, formatJourLong } from '@/lib/format';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { libelleType, type StatutPastille, statutJour } from '../presentation';
import type { JourSemaine } from '../types';

const apparences: Record<StatutPastille, { fond: string; bordure: string; texte: string }> = {
  fait: { fond: colors.accent, bordure: colors.accent, texte: colors.surAccent },
  aujourdhui: { fond: 'transparent', bordure: colors.accent, texte: colors.accent },
  prevu: { fond: 'transparent', bordure: colors.discret, texte: colors.texte2 },
  manque: { fond: 'transparent', bordure: colors.alerte, texte: colors.alerte },
  repos: { fond: colors.carte2, bordure: colors.carte2, texte: colors.discret },
};

export function JourPastille({ jour }: { jour: JourSemaine }) {
  const { t } = useTranslation();
  const date = dateLocale(jour.date);
  const statut = statutJour(jour);
  const apparence = apparences[statut];
  const type = jour.seances[0] ? libelleType(jour.seances[0].type) : t('accueil.seance.repos');

  return (
    <View
      style={styles.jour}
      accessible
      accessibilityLabel={t('accueil.semaine.a11yJour', {
        jour: formatJourLong(date),
        type,
        statut: t(`accueil.semaine.statut.${statut}`),
      })}>
      <View style={[styles.pastille, { backgroundColor: apparence.fond, borderColor: apparence.bordure }]}>
        <AppText variant="corpsGras" color={apparence.texte} style={styles.initiale}>
          {formatJourCourt(date)}
        </AppText>
      </View>
      <AppText variant="libelle" numberOfLines={1}>
        {type}
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
});

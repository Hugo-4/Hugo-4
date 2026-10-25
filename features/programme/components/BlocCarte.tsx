import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { formatJourDate } from '@/lib/format';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { libellePhase } from '../presentation';
import type { BlocProgramme } from '../types';

/** Largeur d'une carte de la frise : environ deux cartes et demie visibles, pour inviter à faire défiler. */
export const LARGEUR_BLOC = sizes.graphique + spacing.xxxl;

/** Un bloc de la frise : nom, phase, dates, semaine allégée ; le bloc en cours a un contour accent et le libellé « En cours ». */
export function BlocCarte({ bloc }: { bloc: BlocProgramme }) {
  const { t } = useTranslation();
  const enCours = bloc.statut === 'en_cours';
  const statut = t(`programme.blocs.statuts.${bloc.statut}`);
  const dates = t('programme.blocs.dates', { debut: formatJourDate(bloc.date_debut), fin: formatJourDate(bloc.date_fin) });
  const allegee = bloc.semaine_deload ? t('programme.blocs.allegee', { numero: bloc.semaine_deload }) : null;
  const semaines = bloc.nb_semaines ? t('programme.blocs.semaines', { count: bloc.nb_semaines }) : null;

  return (
    <View
      style={[styles.carte, enCours && styles.enCours]}
      accessible
      accessibilityLabel={[statut, bloc.nom, libellePhase(bloc.phase), dates, semaines, allegee].filter(Boolean).join(', ')}>
      <AppText variant="surTitre" color={enCours ? colors.accent : colors.discret}>
        {statut}
      </AppText>
      <AppText variant="corpsGras" numberOfLines={2}>
        {bloc.nom}
      </AppText>
      <AppText variant="secondaire">{libellePhase(bloc.phase)}</AppText>
      <AppText variant="libelle">{[dates, semaines].filter(Boolean).join(' · ')}</AppText>
      {allegee ? (
        <AppText variant="libelle" color={colors.texte2}>
          {allegee}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  carte: {
    width: LARGEUR_BLOC,
    gap: spacing.xs,
    padding: spacing.carte,
    borderRadius: radius.carte,
    backgroundColor: colors.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
  },
  enCours: { borderColor: colors.accent, borderWidth: sizes.bordureForte },
});

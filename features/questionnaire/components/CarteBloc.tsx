import { CheckCircle2, ChevronRight, Circle, CircleDot } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { texteAideSection, texteSection } from '../textes';
import type { Bloc } from '../types';

/** Un bloc de la liste : icône d'état (jamais la couleur seule), titre, avancement. */
export function CarteBloc({ bloc, onPress }: { bloc: Bloc; onPress: () => void }) {
  const { t } = useTranslation();
  const total = bloc.questions.length;
  const termine = bloc.faites >= total;
  const section = texteSection(t, bloc.section);
  const titre =
    bloc.totalSection > 1 ? t('questionnaire.bloc.titre', { section, numero: bloc.numero, total: bloc.totalSection }) : section;
  const etat = termine
    ? t('questionnaire.bloc.termine')
    : bloc.faites > 0
      ? t('questionnaire.bloc.enCours', { faites: bloc.faites, total })
      : t('questionnaire.bloc.aFaire', { count: total });
  const Icone = termine ? CheckCircle2 : bloc.faites > 0 ? CircleDot : Circle;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('questionnaire.bloc.a11y', { titre, etat })}
      onPress={onPress}
      style={({ pressed }) => [styles.carte, !termine && styles.aFaire, pressed && styles.presse]}>
      <Icone color={termine ? colors.discret : colors.accent} size={sizes.icone} />
      <View style={styles.textes}>
        <AppText variant="corpsGras">{titre}</AppText>
        <AppText variant="secondaire">{termine ? etat : `${texteAideSection(t, bloc.section)} · ${etat}`}</AppText>
      </View>
      <ChevronRight color={colors.discret} size={sizes.icone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  carte: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: sizes.cibleTactile + spacing.l,
    padding: spacing.carte,
    borderRadius: radius.carte,
    backgroundColor: colors.carte,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
  },
  aFaire: { borderColor: colors.bordureChamp },
  presse: { opacity: opacity.presse },
  textes: { flex: 1, gap: spacing.xxs },
});

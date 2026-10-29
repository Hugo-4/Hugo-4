import { CheckCircle2, ChevronRight, CircleDot, Sparkles } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { formatDateJour } from '@/features/progres/format';
import type { TestAthlete } from '@/features/progres/types';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import { partParcourue, valeurActuelle } from '../avancement';
import { formatValeurEtape } from '../format';
import type { SousObjectif } from '../types';

/** Une étape : statut (icône + texte, jamais la couleur seule), date, cible, avancement d'après la dernière mesure. */
export function LigneEtape({ etape, tests, onPress }: { etape: SousObjectif; tests: TestAthlete[]; onPress: () => void }) {
  const { t } = useTranslation();
  const mesure = valeurActuelle(etape, tests);
  const part = partParcourue(etape, mesure?.valeur ?? null);
  const Icone = etape.statut === 'atteint' ? CheckCircle2 : etape.statut === 'propose' ? Sparkles : CircleDot;
  const details = [
    formatDateJour(etape.date_cible),
    etape.valeur_cible !== null ? t('objectifs.cible', { valeur: formatValeurEtape(t, etape.valeur_cible, etape.unite) }) : null,
    t(`objectifs.statuts.${etape.statut}`),
  ]
    .filter(Boolean)
    .join(' · ');

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={`${etape.titre}, ${details}`}
      onPress={onPress}
      style={({ pressed }) => [styles.ligne, pressed && styles.presse]}>
      <Icone color={etape.statut === 'atteint' ? colors.discret : colors.accent} size={sizes.icone} />
      <View style={styles.textes}>
        <AppText variant="corpsGras" style={etape.statut === 'atteint' ? styles.atteint : undefined}>
          {etape.titre}
        </AppText>
        <AppText variant="secondaire">{details}</AppText>
        {part !== null && mesure ? (
          <View style={styles.avancement}>
            <ProgressBar progression={part} accessibilityLabel={t('objectifs.a11yAvancement', { pct: Math.round(part * 100) })} />
            <AppText variant="libelle">
              {t('objectifs.derniereMesure', { valeur: formatValeurEtape(t, mesure.valeur, etape.unite), date: formatDateJour(mesure.date_test) })}
            </AppText>
          </View>
        ) : null}
      </View>
      <ChevronRight color={colors.discret} size={sizes.icone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.cibleTactile, paddingVertical: spacing.s },
  presse: { opacity: opacity.presse },
  textes: { flex: 1, gap: spacing.xxs },
  atteint: { textDecorationLine: 'line-through' },
  avancement: { gap: spacing.xxs, marginTop: spacing.xs },
});

import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { formatDateJour, formatValeur } from '../format';
import { libelleMethode, libelleTest } from '../presentation';
import type { GroupeTest } from '../regroupement';
import { MiniCourbe } from './MiniCourbe';

type Props = {
  groupe: GroupeTest;
  /** Ouvre le détail du test (niveau 3). Sans action : simple ligne d'aperçu. */
  onPress?: () => void;
};

/** Un test : nom, date et méthode du dernier résultat, mini-courbe, dernière valeur. */
export function LigneTest({ groupe, onPress }: Props) {
  const { t } = useTranslation();
  const nom = libelleTest(groupe);
  const valeur = formatValeur(groupe.dernier.valeur, groupe.type.unite);
  const date = formatDateJour(groupe.dernier.date_test);
  const details = [date, libelleMethode(groupe.dernier.methode)].filter(Boolean).join(' · ');

  const contenu = (
    <>
      <View style={styles.textes}>
        <AppText variant="corpsGras" numberOfLines={2}>
          {nom}
        </AppText>
        <AppText variant="libelle">{details}</AppText>
      </View>
      <MiniCourbe valeurs={groupe.resultats.map((r) => r.valeur)} />
      <AppText variant="chiffre" style={styles.valeur} maxFontSizeMultiplier={multiplicateurMax}>
        {valeur}
      </AppText>
      {onPress ? <ChevronRight color={colors.discret} size={sizes.icone} /> : null}
    </>
  );

  if (!onPress) return <View style={styles.ligne}>{contenu}</View>;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('progres.tests.a11yLigne', { nom, valeur, date })}
      accessibilityHint={t('progres.ouvrir')}
      onPress={onPress}
      style={({ pressed }) => [styles.ligne, styles.tactile, pressed && styles.presse]}>
      {contenu}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.pasAPas },
  tactile: { paddingVertical: spacing.s },
  textes: { flex: 1, gap: spacing.xxs },
  valeur: { flexShrink: 0 },
  presse: { opacity: opacity.presse },
});

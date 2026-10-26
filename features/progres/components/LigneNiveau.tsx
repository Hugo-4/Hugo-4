import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { formatNombre } from '@/lib/format';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import { libelleComparaison, libelleGroupe } from '../presentation';
import type { QualiteNiveau } from '../types';

type Props = {
  qualite: QualiteNiveau;
  /** Le groupe de comparaison est toujours affiché : sur la ligne, ou une seule fois sous la liste s'il est commun. */
  afficherGroupe: boolean;
  onPress?: () => void;
};

/** Percentile d'une qualité : texte « Mieux que 72 % du groupe » + barre (jamais la couleur seule). */
export function LigneNiveau({ qualite, afficherGroupe, onPress }: Props) {
  const { t } = useTranslation();
  const pourcentage = formatNombre(Math.round(qualite.percentile));
  const a11y = t('progres.niveaux.a11y', { qualite: qualite.libelle, pourcentage, groupe: libelleGroupe(qualite.groupe) });

  const contenu = (
    <View style={styles.bloc}>
      <View style={styles.ligne}>
        <AppText variant="corpsGras" style={styles.nom}>
          {qualite.libelle}
        </AppText>
        <AppText variant="secondaire">{t('progres.niveaux.mieuxQue', { pourcentage })}</AppText>
        {onPress ? <ChevronRight color={colors.discret} size={sizes.icone} /> : null}
      </View>
      <ProgressBar progression={qualite.percentile / 100} accessibilityLabel={a11y} />
      {afficherGroupe ? <AppText variant="libelle">{libelleComparaison(qualite.groupe)}</AppText> : null}
    </View>
  );

  if (!onPress) return contenu;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={a11y}
      accessibilityHint={t('progres.ouvrir')}
      onPress={onPress}
      style={({ pressed }) => [styles.tactile, pressed && styles.presse]}>
      {contenu}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  nom: { flex: 1 },
  tactile: { minHeight: sizes.pasAPas, justifyContent: 'center', paddingVertical: spacing.s },
  presse: { opacity: opacity.presse },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { spacing } from '@/theme/tokens';

import { formatCible, formatQuantite, progressionVers } from '../format';

type Props = { libelle: string; consomme: number; unite: string; cible: number | [number, number] | null };

/** Un nutriment du jour : ce qui est noté, face à la cible du coach quand il en a donné une. */
export function LigneObjectif({ libelle, consomme, unite, cible }: Props) {
  const { t } = useTranslation();
  const valeur = cible
    ? t('nutrition.surCible', { consomme: formatQuantite(consomme), cible: formatCible(cible), unite })
    : t('nutrition.valeurUnite', { valeur: formatQuantite(consomme), unite });
  return (
    <View style={styles.bloc}>
      <View style={styles.ligne}>
        <AppText variant="secondaire">{libelle}</AppText>
        <AppText variant="corpsGras">{valeur}</AppText>
      </View>
      {cible ? <ProgressBar progression={progressionVers(consomme, cible)} accessibilityLabel={`${libelle} : ${valeur}`} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.s },
});

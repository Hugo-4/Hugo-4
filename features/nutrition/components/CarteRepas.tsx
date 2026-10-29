import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, sizes, spacing } from '@/theme/tokens';

import { formatQuantite } from '../format';
import type { EntreeJournal, MomentRepas } from '../types';
import type { GroupeRepas } from '../useNutrition';
import { LigneAliment } from './LigneAliment';

type Props = { calories: boolean; date: string; groupes: GroupeRepas[]; onRetirer: (ligne: EntreeJournal) => void; desactive: boolean };

const ajouter = (date: string, moment?: MomentRepas) =>
  router.push({ pathname: '/nutrition/ajouter', params: moment ? { date, moment } : { date } });

/** Ce qui a été mangé ce jour, par moment, avec le total de chaque moment (répartition des protéines et glucides). */
export function CarteRepas({ calories, date, groupes, onRetirer, desactive }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('nutrition.repas.titre')}</AppText>
      {groupes.length === 0 ? <AppText variant="secondaire">{t('nutrition.repas.aucun')}</AppText> : null}
      {groupes.map((groupe) => (
        <View key={groupe.moment} style={styles.groupe}>
          <View style={styles.entete}>
            <AppText variant="corpsGras">{t(`nutrition.moments.${groupe.moment}`)}</AppText>
            <AppText variant="libelle" color={colors.texte2}>
              {t(calories ? 'nutrition.repas.totalMoment' : 'nutrition.repas.totalMomentSansCalories', {
                kcal: formatQuantite(groupe.total.calories),
                p: formatQuantite(groupe.total.proteines),
                g: formatQuantite(groupe.total.glucides),
              })}
            </AppText>
          </View>
          {groupe.lignes.map((ligne) => (
            <LigneAliment key={ligne.id} calories={calories} ligne={ligne} onRetirer={() => onRetirer(ligne)} desactive={desactive} />
          ))}
          <Button label={t('nutrition.repas.ajouterIci')} variant="discret" onPress={() => ajouter(date, groupe.moment)} />
        </View>
      ))}
      <Button label={t('nutrition.noterAliment')} onPress={() => ajouter(date)} />
    </Card>
  );
}

const styles = StyleSheet.create({
  groupe: { gap: spacing.xs, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne, paddingTop: spacing.m },
  entete: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'baseline', gap: spacing.s, flexWrap: 'wrap' },
});

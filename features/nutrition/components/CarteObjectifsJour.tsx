import { router } from 'expo-router';
import type { UseQueryResult } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import type { NutritionJour } from '@/features/accueil/types';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { ObjectifsNutritionnels, TotauxJour } from '../types';
import { LigneObjectif } from './LigneObjectif';

/** Niveaux de charge du serveur (tools/nutritionSeance.js, niveauCharge). */
const NIVEAUX = ['repos', 'leger', 'modere', 'eleve', 'tres_eleve'] as const;
type Niveau = (typeof NIVEAUX)[number];

type Props = {
  /** Calories affichées (masquées par défaut avant 18 ans). */
  calories: boolean;
  /** Totaux du jour (`journal_nutrition`). */
  total: TotauxJour;
  objectifs: ObjectifsNutritionnels | null | undefined;
  /** Plan du jour (aujourd'hui seulement) ; `null` pour un autre jour. */
  plan: UseQueryResult<NutritionJour | null> | null;
};

/**
 * Ce qui est noté face aux cibles du coach : glucides et protéines du plan de la séance du jour,
 * sinon des objectifs nutritionnels ; calories, lipides et fibres des objectifs quand le serveur les a fixés.
 */
export function CarteObjectifsJour({ calories, total, objectifs, plan }: Props) {
  const { t } = useTranslation();
  const n = plan?.data?.nutrition;
  const aucuneCible = !n && !objectifs;
  const niveau = n ? (NIVEAUX.includes(n.niveau_charge as Niveau) ? t(`nutrition.charge.${n.niveau_charge as Niveau}`) : n.niveau_charge) : '';

  return (
    <Card>
      <AppText variant="surTitre">{t('nutrition.objectifs.titre')}</AppText>
      {plan?.isPending ? <Skeleton hauteur={sizes.cibleTactile} /> : null}
      {calories ? (
        <LigneObjectif libelle={t('nutrition.calories')} consomme={total.calories} unite={t('nutrition.kcal')} cible={objectifs?.calories_cibles ?? null} />
      ) : null}
      <LigneObjectif libelle={t('nutrition.proteines')} consomme={total.proteines} unite={t('nutrition.g')} cible={n?.proteines_jour_g ?? objectifs?.proteines_g ?? null} />
      <LigneObjectif libelle={t('nutrition.glucides')} consomme={total.glucides} unite={t('nutrition.g')} cible={n?.glucides_jour_g ?? objectifs?.glucides_g ?? null} />
      <LigneObjectif libelle={t('nutrition.lipides')} consomme={total.lipides} unite={t('nutrition.g')} cible={objectifs?.lipides_g ?? null} />
      <LigneObjectif libelle={t('nutrition.fibres')} consomme={total.fibres} unite={t('nutrition.g')} cible={objectifs?.fibres_g ?? null} />
      {n ? <AppText variant="libelle">{t('nutrition.objectifs.source', { niveau })}</AppText> : null}
      {n?.alertes.map((alerte) => (
        <AppText key={alerte} variant="secondaire" color={colors.alerte}>
          {alerte}
        </AppText>
      ))}
      {plan?.data === null ? (
        <View style={styles.poids}>
          <AppText variant="secondaire">{t('nutrition.objectifs.poidsInconnu')}</AppText>
          <Button label={t('corps.renseignerPoids')} variant="secondaire" onPress={() => router.push('/compte/corps')} />
        </View>
      ) : aucuneCible && !plan?.isPending ? (
        <AppText variant="libelle">{t('nutrition.objectifs.aucune')}</AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  poids: { gap: spacing.m },
});

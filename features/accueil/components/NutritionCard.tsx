import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { dateDuJour } from '@/features/checkin/dateDuJour';
import { formatQuantite } from '@/features/nutrition/format';
import { useAffichageCalories } from '@/features/nutrition/useAffichageCalories';
import { useTotauxJour } from '@/features/nutrition/useJournal';
import { formatNombre } from '@/lib/format';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { useNutritionJour } from '../useNutritionJour';

const plage = ([a, b]: [number, number]) => `${formatNombre(a)}–${formatNombre(b)}`;

/** Plan nutrition du jour (`GET /nutrition/jour`), selon la séance prévue, et ce qui est déjà noté (étape 14). */
export function NutritionCard() {
  const { t } = useTranslation();
  const requete = useNutritionJour();
  const totaux = useTotauxJour(dateDuJour());
  const { afficher: calories } = useAffichageCalories();
  const note = totaux.data && totaux.data.calories + totaux.data.proteines + totaux.data.glucides > 0 ? totaux.data : null;

  return (
    <Card>
      <AppText variant="surTitre">{t('accueil.nutrition.titre')}</AppText>
      {requete.isPending ? <Skeleton hauteur={sizes.cibleTactile * 2} /> : null}
      {requete.isError ? (
        <View style={styles.erreur}>
          <AppText variant="secondaire">{t('commun.erreurTitre')}</AppText>
          <Button label={t('commun.reessayer')} variant="discret" onPress={() => requete.refetch()} />
        </View>
      ) : null}
      {requete.data === null ? (
        <View style={styles.poids}>
          <AppText variant="secondaire">{t('accueil.nutrition.poidsInconnu')}</AppText>
          <Button label={t('corps.renseignerPoids')} variant="secondaire" onPress={() => router.push('/compte/corps')} />
        </View>
      ) : null}
      {requete.data ? (
        <>
          <View style={styles.valeurs}>
            <Valeur libelle={t('accueil.nutrition.glucides')} valeur={t('accueil.nutrition.grammes', { plage: plage(requete.data.nutrition.glucides_jour_g) })} />
            <Valeur libelle={t('accueil.nutrition.proteines')} valeur={t('accueil.nutrition.grammes', { plage: plage(requete.data.nutrition.proteines_jour_g) })} />
            {requete.data.nutrition.hydratation ? (
              <Valeur
                libelle={t('accueil.nutrition.eau')}
                valeur={t('accueil.nutrition.mlParHeure', { plage: plage(requete.data.nutrition.hydratation.pendant_ml_h) })}
              />
            ) : null}
          </View>
          {requete.data.nutrition.alertes.map((alerte) => (
            <AppText key={alerte} variant="secondaire" color={colors.alerte}>
              {alerte}
            </AppText>
          ))}
        </>
      ) : null}
      {note ? (
        <AppText variant="secondaire">
          {t(calories ? 'nutrition.resumeAccueil' : 'nutrition.resumeAccueilSansCalories', { kcal: formatQuantite(note.calories), p: formatQuantite(note.proteines), g: formatQuantite(note.glucides) })}
        </AppText>
      ) : null}
      <View style={styles.actions}>
        <Button label={t('nutrition.noterAliment')} variant="secondaire" onPress={() => router.push('/nutrition/ajouter')} />
        <Button label={t('nutrition.voirJournal')} variant="discret" onPress={() => router.push('/nutrition')} />
      </View>
    </Card>
  );
}

function Valeur({ libelle, valeur }: { libelle: string; valeur: string }) {
  return (
    <View style={styles.valeur}>
      <AppText variant="libelle">{libelle}</AppText>
      <AppText variant="corpsGras">{valeur}</AppText>
    </View>
  );
}

const styles = StyleSheet.create({
  erreur: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  poids: { gap: spacing.m },
  actions: { gap: spacing.s },
  valeurs: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  valeur: {
    flexGrow: 1,
    gap: spacing.xxs,
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    padding: spacing.m,
  },
});

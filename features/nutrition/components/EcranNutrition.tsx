import { router } from 'expo-router';
import { Plus } from 'lucide-react-native';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { useNutrition } from '../useNutrition';
import { CarteEquilibre } from './CarteEquilibre';
import { CarteMicros } from './CarteMicros';
import { CarteObjectifsJour } from './CarteObjectifsJour';
import { CarteRepas } from './CarteRepas';
import { CarteTiming } from './CarteTiming';
import { SelecteurJour } from './SelecteurJour';

/** Nutrition : le jour noté face aux cibles du coach, le timing autour de la séance, l'équilibre et les micronutriments. */
export function EcranNutrition() {
  const { t } = useTranslation();
  const enLigne = useEnLigne();
  const n = useNutrition();
  const rafraichir = () => {
    n.journal.refetch();
    n.totauxJour.refetch();
    n.objectifs.refetch();
    n.plan?.refetch();
  };

  return (
    <Screen>
      <EnTete
        titre={t('nutrition.titre')}
        action={
          <IconButton
            accessibilityLabel={t('nutrition.noterAliment')}
            onPress={() => router.push({ pathname: '/nutrition/ajouter', params: { date: n.date } })}>
            <Plus color={colors.accent} size={sizes.icone} />
          </IconButton>
        }
      />
      <View style={styles.jour}>
        <SelecteurJour date={n.date} estAujourdhui={n.estAujourdhui} onPrecedent={n.precedent} onSuivant={n.suivant} />
      </View>
      <EtatsEcran
        chargement={n.journal.isPending}
        erreur={n.journal.error}
        aDesDonnees={n.journal.data !== undefined}
        onReessayer={rafraichir}
        squelette={
          <View style={styles.contenu}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} hauteur={sizes.graphique / 2} arrondi={radius.carte} />
            ))}
          </View>
        }>
        <ScrollView
          contentContainerStyle={styles.contenu}
          refreshControl={<RefreshControl refreshing={n.journal.isRefetching} onRefresh={rafraichir} tintColor={colors.accent} />}>
          <CarteObjectifsJour total={n.total} objectifs={n.objectifs.data} plan={n.plan} />
          {n.plan?.data ? <CarteTiming plan={n.plan.data} groupes={n.groupes} /> : null}
          {n.actions.supprimer.error ? <ErreurEnregistrement erreur={n.actions.supprimer.error} /> : null}
          <CarteRepas date={n.date} groupes={n.groupes} onRetirer={n.retirer} desactive={!enLigne || n.actions.supprimer.isPending} />
          <CarteEquilibre total={n.total} parts={n.equilibre} />
          <CarteMicros micros={n.micros} surveilles={n.objectifs.data?.micronutriments_surveilles ?? null} />
        </ScrollView>
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  jour: { paddingHorizontal: spacing.ecran },
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
});

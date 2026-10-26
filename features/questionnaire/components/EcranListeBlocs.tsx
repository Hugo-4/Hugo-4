import { router } from 'expo-router';
import { CheckCircle2 } from 'lucide-react-native';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { ProgressBar } from '@/components/ProgressBar';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { useQuestionnaire } from '../useQuestionnaire';
import { CarteBloc } from './CarteBloc';

/** « Finir mon inscription » : avancement global et blocs de 3 à 5 questions, les plus utiles d'abord. */
export function EcranListeBlocs() {
  const { t } = useTranslation();
  const q = useQuestionnaire();

  return (
    <Screen>
      <EnTete titre={t('questionnaire.titre')} />
      <EtatsEcran
        chargement={q.chargement}
        erreur={q.donnees.error}
        aDesDonnees={q.pret}
        onReessayer={q.donnees.refetch}
        squelette={
          <View style={styles.contenu}>
            {[0, 1, 2, 3, 4].map((i) => (
              <Skeleton key={i} hauteur={sizes.cibleTactile + spacing.xxl} arrondi={radius.carte} />
            ))}
          </View>
        }>
        {q.pret ? (
          <ScrollView
            contentContainerStyle={styles.contenu}
            refreshControl={<RefreshControl refreshing={q.donnees.isRefetching} onRefresh={() => {
              q.donnees.refetch();
            }} tintColor={colors.accent} />}>
            {q.reste === 0 ? (
              <View style={styles.termine}>
                <CheckCircle2 color={colors.accent} size={sizes.icone} />
                <View style={styles.flex}>
                  <AppText variant="corpsGras">{t('questionnaire.termineTitre')}</AppText>
                  <AppText variant="secondaire">{t('questionnaire.termineTexte')}</AppText>
                </View>
              </View>
            ) : (
              <AppText variant="secondaire">{t('questionnaire.intro')}</AppText>
            )}
            <View style={styles.avancement}>
              <ProgressBar progression={q.pourcentage / 100} accessibilityLabel={t('questionnaire.pourcentage', { pct: q.pourcentage })} />
              <AppText variant="libelle">{t('questionnaire.pourcentage', { pct: q.pourcentage })}</AppText>
            </View>
            {q.blocs.map((bloc) => (
              <CarteBloc key={bloc.id} bloc={bloc} onPress={() => router.push({ pathname: '/questionnaire/[bloc]', params: { bloc: bloc.id } })} />
            ))}
            <AppText variant="libelle">{t('questionnaire.organisationLien')}</AppText>
          </ScrollView>
        ) : null}
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.m },
  avancement: { gap: spacing.xs },
  termine: { flexDirection: 'row', gap: spacing.m, alignItems: 'center' },
  flex: { flex: 1 },
});

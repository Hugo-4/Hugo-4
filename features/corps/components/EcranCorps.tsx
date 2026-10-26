import { useState } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { useRepondre } from '@/features/questionnaire/useRepondre';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { useCorps } from '../useCorps';
import { useEnregistrerPoids } from '../usePoids';
import { CarteDetails } from './CarteDetails';
import { CarteMensurations } from './CarteMensurations';
import { CarteQuotidien } from './CarteQuotidien';
import { FeuilleMesure } from './FeuilleMesure';

/** Mon corps (Profil) : taille et poids en un geste, le quotidien, puis les mesures plus poussées. */
export function EcranCorps() {
  const { t } = useTranslation();
  const c = useCorps();
  const q = c.questionnaire;
  const repondre = useRepondre(q.pret ? q.sportProfilId : null);
  const pesee = useEnregistrerPoids();
  const [feuille, setFeuille] = useState<'taille' | 'poids' | null>(null);
  const taille = typeof c.valeurs.TC09 === 'number' ? c.valeurs.TC09 : null;
  const poidsProfil = typeof c.valeurs.TC10 === 'number' ? c.valeurs.TC10 : null;
  const fermer = () => setFeuille(null);

  return (
    <Screen>
      <EnTete titre={t('corps.titre')} />
      <EtatsEcran
        chargement={q.chargement}
        erreur={q.donnees.error}
        aDesDonnees={q.pret}
        onReessayer={q.donnees.refetch}
        squelette={
          <View style={styles.contenu}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} hauteur={sizes.graphique} arrondi={radius.carte} />
            ))}
          </View>
        }>
        <ScrollView
          contentContainerStyle={styles.contenu}
          refreshControl={
            <RefreshControl
              refreshing={q.donnees.isRefetching}
              onRefresh={() => {
                q.donnees.refetch();
                c.poids.refetch();
              }}
              tintColor={colors.accent}
            />
          }>
          <CarteMensurations
            taille={taille}
            poidsCommente={c.poidsCommente}
            poidsProfil={poidsProfil}
            historique={c.poids.data}
            onTaille={() => setFeuille('taille')}
            onPoids={() => setFeuille('poids')}
          />
          <CarteQuotidien valeurs={c.valeurs} />
          <CarteDetails details={c.details} />
        </ScrollView>
      </EtatsEcran>
      <FeuilleMesure
        key={`taille-${taille}`}
        mesure="taille"
        visible={feuille === 'taille'}
        valeurActuelle={taille}
        enCours={repondre.isPending}
        erreur={repondre.error}
        onFermer={fermer}
        onEnregistrer={(valeur) => c.questionTaille && repondre.mutate({ question: c.questionTaille, valeur }, { onSuccess: fermer })}
      />
      <FeuilleMesure
        key={`poids-${poidsProfil}`}
        mesure="poids"
        visible={feuille === 'poids'}
        valeurActuelle={poidsProfil}
        enCours={pesee.isPending}
        erreur={pesee.error}
        onFermer={fermer}
        onEnregistrer={(poids_kg, moment) => pesee.mutate({ poids_kg, ...(moment ? { moment } : {}) }, { onSuccess: fermer })}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
});

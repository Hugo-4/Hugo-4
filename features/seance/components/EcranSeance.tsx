import { router, useFocusEffect } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { Alert, BackHandler, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Segmente } from '@/components/Segmente';
import { spacing } from '@/theme/tokens';

import { exercicesDe } from '../etat';
import { useSeance } from '../SeanceProvider';
import { lireVue, sauverVue } from '../stockageSeance';
import type { Vue } from '../types';
import { useActionsSeance } from '../useActionsSeance';
import { useNotificationRepos } from '../useNotificationRepos';
import { BandeauEnvoi } from './BandeauEnvoi';
import { BoutonDouleur } from './BoutonDouleur';
import { EnteteSeance } from './EnteteSeance';
import { SeanceVide } from './SeanceVide';
import { FeuillesExercice } from './FeuillesExercice';
import { VueExercice } from './VueExercice';
import { VueListe } from './VueListe';

type Feuille = 'fiche' | 'menu' | 'douleur' | null;

/** En séance : en-tête, bascule Exercice / Toute la séance, douleur toujours visible. */
export function EcranSeance() {
  const { t } = useTranslation();
  const { etat, dispatch } = useSeance();
  const { abandonner } = useActionsSeance();
  useNotificationRepos();
  const [vue, setVue] = useState<Vue>('exercice');
  const [feuille, setFeuille] = useState<Feuille>(null);
  const exercice = exercicesDe(etat.seance)[etat.index] ?? null;
  const allerFin = () => router.push(`/seance/${etat.programmeSeanceId}/fin`);

  useEffect(() => {
    lireVue().then(setVue);
  }, []);
  const changerVue = (v: Vue) => {
    setVue(v);
    sauverVue(v).catch(() => undefined);
  };

  const quitter = useCallback(() => {
    const commencee = Object.values(etat.series).some((s) => s.length > 0);
    if (!commencee) {
      abandonner().then(() => router.back());
      return;
    }
    Alert.alert(t('enSeance.quitterTitre'), t('enSeance.quitterTexte'), [
      { text: t('enSeance.terminer'), onPress: allerFin },
      { text: t('enSeance.abandonner'), style: 'destructive', onPress: () => abandonner().then(() => router.back()) },
      { text: t('commun.annuler'), style: 'cancel' },
    ]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [etat.series, abandonner, t]);

  // Bouton retour d'Android : même confirmation que la croix (la modale ne se ferme pas d'un geste).
  useFocusEffect(
    useCallback(() => {
      const abonnement = BackHandler.addEventListener('hardwareBackPress', () => {
        quitter();
        return true;
      });
      return () => abonnement.remove();
    }, [quitter]),
  );

  if (exercicesDe(etat.seance).length === 0) {
    return <SeanceVide onFermer={() => abandonner().then(() => router.back())} />;
  }

  return (
    <View style={styles.ecran}>
      <EnteteSeance onQuitter={quitter} />
      <View style={styles.outils}>
        <BandeauEnvoi />
        <View style={styles.ligne}>
          <View style={styles.flex}>
            <Segmente
              accessibilityLabel={t('enSeance.vue.a11y')}
              valeur={vue}
              onChange={changerVue}
              options={[
                { valeur: 'exercice', label: t('enSeance.vue.exercice') },
                { valeur: 'liste', label: t('enSeance.vue.liste') },
              ]}
            />
          </View>
          <BoutonDouleur onPress={() => setFeuille('douleur')} />
        </View>
      </View>
      {vue === 'exercice' ? (
        <VueExercice onFiche={() => setFeuille('fiche')} onMenu={() => setFeuille('menu')} onTerminer={allerFin} />
      ) : (
        <VueListe
          onOuvrir={(index) => {
            dispatch({ type: 'aller', index });
            changerVue('exercice');
          }}
        />
      )}
      <FeuillesExercice exercice={exercice} feuille={feuille} onFermer={() => setFeuille(null)} />
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1 },
  outils: { paddingHorizontal: spacing.ecran, paddingTop: spacing.m, gap: spacing.s },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  flex: { flex: 1 },
});

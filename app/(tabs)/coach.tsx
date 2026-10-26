import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { ROUTE_COACH } from '@/components/TabBar';
import { EcranCoach } from '@/features/coach/components/EcranCoach';

type NavigationOnglet = {
  addListener: (evenement: 'blur', rappel: () => void) => () => void;
  getState: () => { index: number; routes: { name: string }[] };
  setParams: (params: { contexte?: string }) => void;
};

/** Onglet Coach : le chat (la barre d'onglets est masquée, l'en-tête a son bouton retour). */
export default function CoachScreen() {
  const navigation = useNavigation() as unknown as NavigationOnglet;
  // En quittant l'onglet pour un autre, le contexte (séance, exercice) est oublié : rouvert par l'onglet, le Coach
  // repart sans contexte. Un écran ouvert par-dessus le Coach (abonnement…) le laisse intact au retour.
  useEffect(
    () =>
      navigation.addListener('blur', () => {
        const onglets = navigation.getState();
        if (onglets.routes[onglets.index]?.name !== ROUTE_COACH) navigation.setParams({ contexte: undefined });
      }),
    [navigation],
  );
  return <EcranCoach />;
}

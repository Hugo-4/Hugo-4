import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { EcranCoach } from '@/features/coach/components/EcranCoach';

type NavigationOnglet = {
  addListener: (evenement: 'tabPress', rappel: () => void) => () => void;
  setParams: (params: { contexte?: string }) => void;
};

/** Onglet Coach : le chat (la barre d'onglets est masquée, l'en-tête a son bouton retour). */
export default function CoachScreen() {
  const navigation = useNavigation() as unknown as NavigationOnglet;
  // Ouvert par l'onglet : on repart sans contexte (séance, exercice). Un écran ouvert depuis le Coach
  // (abonnement…) le garde au retour.
  useEffect(() => navigation.addListener('tabPress', () => navigation.setParams({ contexte: undefined })), [navigation]);
  return <EcranCoach />;
}

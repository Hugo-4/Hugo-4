import { useNavigation } from 'expo-router';
import { useEffect } from 'react';

import { EcranCoach } from '@/features/coach/components/EcranCoach';

/** Onglet Coach : le chat (la barre d'onglets est masquée, l'en-tête a son bouton retour). */
export default function CoachScreen() {
  const navigation = useNavigation();
  // En quittant l'onglet, le contexte (séance, exercice) est oublié : rouvrir le Coach par l'onglet repart sans contexte.
  useEffect(() => navigation.addListener('blur', () => navigation.setParams({ contexte: undefined } as never)), [navigation]);
  return <EcranCoach />;
}

import { useLocalSearchParams } from 'expo-router';

import { EcranEvenement } from '@/features/programme/components/EcranEvenement';

/** Modifier ou supprimer une compétition (FRONTEND.md §4.5). */
export default function EvenementScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EcranEvenement id={id} />;
}

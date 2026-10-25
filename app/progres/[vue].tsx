import { useLocalSearchParams } from 'expo-router';

import { type ParametresVue, VueProgres } from '@/features/progres/components/VueProgres';

/**
 * Détail Progrès : tests, charge, records, niveaux, régularité, ligues (niveau 2 : la tendance) ;
 * un détail précis passe en paramètre (niveau 3 : `/progres/tests?type=vma`, `/progres/niveaux?qualite=vma`).
 */
export default function ProgresDetailScreen() {
  const parametres = useLocalSearchParams<ParametresVue>();
  return <VueProgres parametres={parametres} />;
}

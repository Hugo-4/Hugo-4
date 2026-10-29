import { useLocalSearchParams } from 'expo-router';

import { EcranAjouterAliment } from '@/features/nutrition/components/EcranAjouterAliment';

/** Noter un aliment dans le journal (paramètres facultatifs : `date`, `moment`). */
export default function AjouterAlimentScreen() {
  const params = useLocalSearchParams<{ date?: string; moment?: string }>();
  return <EcranAjouterAliment params={params} />;
}

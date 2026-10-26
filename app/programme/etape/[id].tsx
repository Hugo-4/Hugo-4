import { useLocalSearchParams } from 'expo-router';

import { EcranEtape } from '@/features/objectifs/components/EcranEtape';

/** Une étape vers l'objectif : `nouvelle` pour en créer une, sinon son identifiant. */
export default function EtapeScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <EcranEtape id={id ?? 'nouvelle'} />;
}

import { useLocalSearchParams } from 'expo-router';

import { EcranBloc } from '@/features/questionnaire/components/EcranBloc';

/** Un bloc du questionnaire (`valeurs-1`…) ou une section entière à revoir (`corps`, depuis le Profil). */
export default function BlocQuestionnaireScreen() {
  const { bloc } = useLocalSearchParams<{ bloc: string }>();
  return <EcranBloc cible={bloc ?? ''} />;
}

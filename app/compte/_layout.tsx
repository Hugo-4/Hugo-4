import { Stack } from 'expo-router';

import { colors } from '@/theme/tokens';

/** Écrans de modification du profil (ouverts depuis l'onglet Profil). */
export default function CompteLayout() {
  return <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }} />;
}

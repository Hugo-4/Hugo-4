import { Stack } from 'expo-router';

import { InscriptionProvider } from '@/features/inscription/InscriptionProvider';
import { colors } from '@/theme/tokens';

export default function InscriptionLayout() {
  return (
    <InscriptionProvider>
      <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="consentements" />
        <Stack.Screen name="questions" />
        <Stack.Screen name="parent" />
        <Stack.Screen name="generation" options={{ gestureEnabled: false }} />
      </Stack>
    </InscriptionProvider>
  );
}

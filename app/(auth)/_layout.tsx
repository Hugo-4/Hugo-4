import { Stack } from 'expo-router';

import { colors } from '@/theme/tokens';

export const unstable_settings = {
  initialRouteName: 'connexion',
};

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }}>
      <Stack.Screen name="connexion" />
      <Stack.Screen name="creer-compte" />
    </Stack>
  );
}

import '@/lib/i18n';

import {
  BarlowCondensed_600SemiBold,
  BarlowCondensed_700Bold,
} from '@expo-google-fonts/barlow-condensed';
import {
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import { QueryClientProvider } from '@tanstack/react-query';
import { useFonts } from 'expo-font';
import { DarkTheme, Stack, ThemeProvider, type Theme } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { queryClient } from '@/lib/queryClient';
import { colors } from '@/theme/tokens';

SplashScreen.preventAutoHideAsync();

const theme: Theme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    primary: colors.accent,
    background: colors.fond,
    card: colors.fond,
    text: colors.texte,
    border: colors.ligne,
    notification: colors.alerte,
  },
};

export default function RootLayout() {
  const [policesChargees, erreurPolices] = useFonts({
    BarlowCondensed_600SemiBold,
    BarlowCondensed_700Bold,
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const pret = policesChargees || erreurPolices !== null;

  useEffect(() => {
    if (pret) {
      SplashScreen.hideAsync();
    }
  }, [pret]);

  if (!pret) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider value={theme}>
        <StatusBar style="light" />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }} />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

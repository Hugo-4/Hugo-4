import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useSession } from '@/features/auth/AuthProvider';
import { useStatutCompte } from '@/features/auth/useStatutCompte';
import { colors } from '@/theme/tokens';

import { ErrorState } from './ErrorState';
import { Screen } from './Screen';

type Props = {
  policesPretes: boolean;
};

/**
 * Redirection selon l'état du compte :
 * non connecté → connexion ; connecté sans profil terminé → Inscription ; sinon → onglets (Aujourd'hui).
 * L'écran de démarrage reste affiché tant que cet état n'est pas connu.
 */
export function RootNavigator({ policesPretes }: Props) {
  const { session, pret } = useSession();
  const statut = useStatutCompte(session?.user.id);
  const connecte = session !== null;
  const etatConnu = pret && (!connecte || !statut.isPending);
  const toutPret = policesPretes && etatConnu;

  useEffect(() => {
    if (toutPret) SplashScreen.hideAsync();
  }, [toutPret]);

  if (!toutPret) {
    return null;
  }

  if (connecte && statut.isError) {
    return (
      <Screen>
        <ErrorState onRetry={statut.refetch} />
      </Screen>
    );
  }

  const profilTermine = statut.data?.onboardingComplete === true;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }}>
      <Stack.Protected guard={!connecte}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={connecte && !profilTermine}>
        <Stack.Screen name="inscription" />
      </Stack.Protected>
      <Stack.Protected guard={connecte && profilTermine}>
        <Stack.Screen name="(tabs)" />
      </Stack.Protected>
    </Stack>
  );
}

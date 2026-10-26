import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

import { useSession } from '@/features/auth/AuthProvider';
import { useStatutCompte } from '@/features/auth/useStatutCompte';
import { useLangueProfil } from '@/features/langue/useLangueProfil';
import { colors, radius } from '@/theme/tokens';

import { ErrorState } from './ErrorState';
import { Screen } from './Screen';

type Props = {
  policesPretes: boolean;
};

/**
 * Redirection selon l'état du compte :
 * lien « mot de passe oublié » → nouveau mot de passe ; non connecté → connexion ;
 * connecté sans profil terminé → Inscription ; sinon → onglets (Aujourd'hui).
 * L'écran de démarrage reste affiché tant que cet état n'est pas connu.
 */
export function RootNavigator({ policesPretes }: Props) {
  const { session, pret, recuperation } = useSession();
  const statut = useStatutCompte(session?.user.id);
  useLangueProfil(session?.user.id, statut.data);
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
        <ErrorState onRetry={statut.refetch} erreur={statut.error} />
      </Screen>
    );
  }

  const profilTermine = statut.data?.onboardingComplete === true;

  return (
    <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }}>
      <Stack.Protected guard={recuperation}>
        <Stack.Screen name="nouveau-mot-de-passe" />
      </Stack.Protected>
      <Stack.Protected guard={!connecte && !recuperation}>
        <Stack.Screen name="connexion" />
        <Stack.Screen name="creer-compte" />
        <Stack.Screen name="mot-de-passe-oublie" />
        <Stack.Screen name="auth-callback" />
      </Stack.Protected>
      <Stack.Protected guard={connecte && !recuperation && !profilTermine}>
        <Stack.Screen name="inscription" />
      </Stack.Protected>
      <Stack.Protected guard={connecte && !recuperation && profilTermine}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="checkin"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.92],
            sheetGrabberVisible: true,
            sheetCornerRadius: radius.carte,
            contentStyle: { backgroundColor: colors.fond },
          }}
        />
        <Stack.Screen name="seance/[id]" options={{ presentation: 'fullScreenModal', gestureEnabled: false }} />
        <Stack.Screen name="compte" />
        <Stack.Screen name="notifications" />
        <Stack.Screen name="coach-seance" options={{ presentation: 'modal' }} />
        <Stack.Screen name="programme/seance/[id]" />
        <Stack.Screen name="programme/evenement/nouveau" />
        <Stack.Screen name="programme/evenement/[id]" />
        <Stack.Screen name="programme/adaptations" />
        <Stack.Screen name="progres/[vue]" />
        <Stack.Screen
          name="exercice/[slug]"
          options={{
            presentation: 'formSheet',
            sheetAllowedDetents: [0.6, 0.92],
            sheetGrabberVisible: true,
            sheetCornerRadius: radius.carte,
          }}
        />
      </Stack.Protected>
    </Stack>
  );
}

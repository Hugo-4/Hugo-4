import NetInfo from '@react-native-community/netinfo';
import { focusManager, onlineManager, QueryClient } from '@tanstack/react-query';
import { AppState, Platform } from 'react-native';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 60_000,
    },
  },
});

// Hors ligne : les requêtes se mettent en pause (les données en cache restent affichées)
// et repartent seules au retour du réseau.
onlineManager.setEventListener((setOnline) => NetInfo.addEventListener((etat) => setOnline(etat.isConnected !== false)));

// Retour au premier plan : les écrans affichés se rafraîchissent.
if (Platform.OS !== 'web') {
  focusManager.setEventListener((setFocused) => {
    const abonnement = AppState.addEventListener('change', (etat) => setFocused(etat === 'active'));
    return () => abonnement.remove();
  });
}

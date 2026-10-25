import { useKeepAwake } from 'expo-keep-awake';
import { Stack, useLocalSearchParams } from 'expo-router';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ErrorState } from '@/components/ErrorState';
import { SeanceSkeleton } from '@/features/seance/components/SeanceSkeleton';
import { SeanceProvider, useChargementSeance } from '@/features/seance/SeanceProvider';
import { colors } from '@/theme/tokens';

/** En séance (plein écran, sans onglets) : écran toujours allumé, séance chargée une fois pour les deux écrans. */
export default function SeanceLayout() {
  useKeepAwake();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { etat, dispatch, chargement, erreur, reessayer } = useChargementSeance(id);

  return (
    <SafeAreaView style={styles.ecran}>
      {etat ? (
        <SeanceProvider etat={etat} dispatch={dispatch}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }} />
        </SeanceProvider>
      ) : chargement ? (
        <SeanceSkeleton />
      ) : (
        <ErrorState onRetry={reessayer} erreur={erreur} />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: colors.fond },
});

import { useKeepAwake } from 'expo-keep-awake';
import { router, Stack, useLocalSearchParams } from 'expo-router';
import { X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

import { ErrorState } from '@/components/ErrorState';
import { IconButton } from '@/components/IconButton';
import { SeanceSkeleton } from '@/features/seance/components/SeanceSkeleton';
import { SeanceProvider, useChargementSeance } from '@/features/seance/SeanceProvider';
import { colors, sizes, spacing } from '@/theme/tokens';

/** En séance (plein écran, sans onglets) : écran toujours allumé, séance chargée une fois pour les deux écrans. */
export default function SeanceLayout() {
  useKeepAwake();
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { etat, dispatch, chargement, erreur, reessayer } = useChargementSeance(id);

  return (
    <SafeAreaView style={styles.ecran}>
      {etat ? (
        <SeanceProvider etat={etat} dispatch={dispatch}>
          <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.fond } }} />
        </SeanceProvider>
      ) : (
        <>
          {/* La modale plein écran ne se ferme pas d'un geste : pendant le chargement ou après une erreur, on peut sortir. */}
          <View style={styles.entete}>
            <IconButton accessibilityLabel={t('commun.fermer')} onPress={() => router.back()}>
              <X color={colors.texte} size={sizes.icone} />
            </IconButton>
          </View>
          {chargement ? <SeanceSkeleton /> : <ErrorState onRetry={reessayer} erreur={erreur} />}
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1, backgroundColor: colors.fond },
  entete: { paddingHorizontal: spacing.ecran, paddingTop: spacing.s },
});

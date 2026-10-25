import { router, useScrollToTop } from 'expo-router';
import { CalendarDays } from 'lucide-react-native';
import { useRef } from 'react';
import { RefreshControl, ScrollView, type ScrollViewInstance, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { ProgrammeContenu } from '@/features/programme/components/ProgrammeContenu';
import { ProgrammeSquelette } from '@/features/programme/components/ProgrammeSquelette';
import { useEcranProgramme } from '@/features/programme/useEcranProgramme';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Onglet Programme : « Qu'est-ce qui m'attend ? » (FRONTEND.md §4.5). */
export default function ProgrammeScreen() {
  const { t } = useTranslation();
  const e = useEcranProgramme();
  const liste = useRef<ScrollViewInstance>(null);
  useScrollToTop(liste);

  return (
    <Screen>
      <ScrollView
        ref={liste}
        contentContainerStyle={styles.contenu}
        refreshControl={<RefreshControl refreshing={e.rafraichissement} onRefresh={e.rafraichir} tintColor={colors.accent} />}>
        <AppText variant="titre" accessibilityRole="header">
          {t('programme.titre')}
        </AppText>
        <EtatsEcran
          chargement={e.chargement}
          erreur={e.erreur}
          aDesDonnees={e.aDesDonnees}
          vide={e.vide}
          onReessayer={e.rafraichir}
          squelette={<ProgrammeSquelette />}
          etatVide={{
            icon: <CalendarDays color={colors.discret} size={sizes.icone * 2} />,
            titre: t('programme.vide.titre'),
            texte: t('programme.vide.texte'),
            action: <Button label={t('programme.vide.action')} onPress={() => router.navigate('/')} />,
          }}>
          <ProgrammeContenu e={e} />
        </EtatsEcran>
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, padding: spacing.ecran, gap: spacing.l },
});

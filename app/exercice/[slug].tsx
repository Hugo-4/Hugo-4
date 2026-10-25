import { router, useLocalSearchParams } from 'expo-router';
import { Dumbbell, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { EtatsEcran } from '@/components/EtatsEcran';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { FicheExerciceContenu } from '@/features/programme/components/FicheExerciceContenu';
import { etatsRequete } from '@/features/programme/etatRequete';
import { useFicheExercice } from '@/features/programme/requetes';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Fiche technique d'un exercice, en feuille (formSheet) : la séance ou le détail continue derrière. */
export default function ExerciceScreen() {
  const { t } = useTranslation();
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const fiche = useFicheExercice(slug);

  return (
    <Screen edges={['left', 'right', 'bottom']}>
      <View style={styles.entete}>
        <AppText variant="sousTitre" accessibilityRole="header" style={styles.titre} numberOfLines={2}>
          {fiche.data?.nom ?? t('programme.exercice.titre')}
        </AppText>
        <IconButton accessibilityLabel={t('commun.fermer')} onPress={() => router.back()}>
          <X color={colors.texte} size={sizes.icone} />
        </IconButton>
      </View>
      <EtatsEcran
        {...etatsRequete(fiche)}
        vide={fiche.data === null}
        onReessayer={() => fiche.refetch()}
        squelette={
          <View style={styles.squelette}>
            <Skeleton hauteur={sizes.graphique} />
            <Skeleton hauteur={sizes.pasAPas * 2} />
          </View>
        }
        etatVide={{
          icon: <Dumbbell color={colors.discret} size={sizes.icone * 2} />,
          titre: t('programme.exercice.introuvableTitre'),
          texte: t('programme.exercice.introuvableTexte'),
        }}>
        {fiche.data ? <FicheExerciceContenu fiche={fiche.data} /> : null}
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, paddingHorizontal: spacing.ecran, paddingTop: spacing.l },
  titre: { flex: 1 },
  squelette: { padding: spacing.ecran, gap: spacing.l },
});

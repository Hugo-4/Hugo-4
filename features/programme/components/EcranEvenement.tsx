import { router } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { colors, sizes, spacing } from '@/theme/tokens';

import { useDonneesEvenement } from '../useDonneesEvenement';
import { ActionEtatVide } from './ActionEtatVide';
import { FormulaireEvenement } from './FormulaireEvenement';

/** Écran Compétition (création si `id` est absent, sinon modification), avec ses états de chargement. */
export function EcranEvenement({ id }: { id?: string }) {
  const { t } = useTranslation();
  const d = useDonneesEvenement(id);

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <EnTete titre={t(id ? 'programme.evenement.titreModifier' : 'programme.evenement.titreNouveau')} />
      <EtatsEcran
        chargement={d.chargement}
        erreur={d.erreur}
        aDesDonnees={d.aDesDonnees}
        vide={d.introuvable}
        onReessayer={d.reessayer}
        squelette={
          <View style={styles.squelette}>
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} hauteur={sizes.pasAPas + spacing.xl} />
            ))}
          </View>
        }
        etatVide={{
          icon: <Trophy color={colors.discret} size={sizes.icone * 2} />,
          titre: t('programme.evenement.introuvableTitre'),
          texte: t('programme.evenement.introuvableTexte'),
          action: <ActionEtatVide label={t('programme.evenement.retourProgramme')} onPress={() => router.navigate('/programme')} />,
        }}>
        <FormulaireEvenement evenement={d.evenement} evenements={d.evenements} sports={d.sports} />
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  squelette: { padding: spacing.ecran, gap: spacing.xl },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { sizes, spacing } from '@/theme/tokens';

import { AMBITIONS } from '../constantes';
import { useInscription } from '../InscriptionProvider';
import { texteLocal } from '../libelles';
import { useObjectifsSport } from '../useReferentiels';

/**
 * Ambition : 4 cartes. Sous chaque carte, le premier objectif du sport pour cette ambition
 * (« Préparer mes combats amateurs »…) pour que le choix parle à l'athlète.
 */
export function EtapeAmbition() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const objectifs = useObjectifsSport(reponses.sportId);

  if (objectifs.isPending) return <Skeleton hauteur={sizes.anneauForme * 2} />;
  if (objectifs.isError) return <ErrorState onRetry={objectifs.refetch} />;

  return (
    <View style={styles.liste} accessibilityRole="radiogroup">
      {AMBITIONS.map((ambition) => {
        const exemple = objectifs.data.find((o) => o.ambition === ambition);
        if (!exemple) return null;
        return (
          <ChoixOption
            key={ambition}
            titre={t(`inscription.ambition.${ambition}`)}
            description={texteLocal(exemple.libelle)}
            selectionne={reponses.ambition === ambition}
            onPress={() => ambition !== reponses.ambition && modifier({ ambition, objectifSport: null })}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});

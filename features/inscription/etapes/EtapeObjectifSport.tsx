import { StyleSheet, View } from 'react-native';

import { ChoixOption } from '@/components/ChoixOption';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { sizes, spacing } from '@/theme/tokens';

import { DetailsObjectif } from '../components/DetailsObjectif';
import { useInscription } from '../InscriptionProvider';
import { texteLocal } from '../libelles';
import { useObjectifsSport } from '../useReferentiels';

/**
 * Objectif précis : objectifs du sport pour l'ambition choisie (`objectifs_sport`).
 * Les qualités physiques (force maximale…) ne sont jamais proposées : le serveur les déduit.
 */
export function EtapeObjectifSport() {
  const { reponses, modifier } = useInscription();
  const objectifs = useObjectifsSport(reponses.sportId);

  if (objectifs.isPending) return <Skeleton hauteur={sizes.anneauForme * 2} />;
  if (objectifs.isError) return <ErrorState onRetry={objectifs.refetch} />;

  const liste = objectifs.data.filter((o) => o.ambition === reponses.ambition);
  return (
    <View style={styles.bloc}>
      <View style={styles.liste} accessibilityRole="radiogroup">
        {liste.map((o) => (
          <ChoixOption
            key={o.id}
            titre={texteLocal(o.libelle)}
            description={o.description ? texteLocal(o.description) : undefined}
            selectionne={reponses.objectifSport?.id === o.id}
            onPress={() =>
              modifier({
                objectifSport: {
                  id: o.id,
                  echeanceRequise: o.echeanceRequise,
                  precisionDemandee: o.precisionDemandee,
                  qualitePrincipale: o.qualitePrincipale,
                },
              })
            }
          />
        ))}
      </View>
      {reponses.objectifSport ? <DetailsObjectif objectif={reponses.objectifSport} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xl },
  liste: { gap: spacing.s },
});

import { StyleSheet, View } from 'react-native';

import { ChoixOption } from '@/components/ChoixOption';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import i18n from '@/lib/i18n';
import { sizes, spacing } from '@/theme/tokens';

import { useInscription } from '../InscriptionProvider';
import { useObjectifsSecondaires } from '../useReferentiels';

const libelle = (slug: string) => {
  const cle = `inscription.secondaires.${slug}`;
  return i18n.exists(cle) ? String(i18n.t(cle as never)) : slug;
};

/** Objectifs secondaires (facultatif, plusieurs choix) → `user_sport_profiles.objectifs_secondaires`. */
export function EtapeObjectifsSecondaires() {
  const { reponses, modifier } = useInscription();
  const requete = useObjectifsSecondaires();
  const choisis = reponses.objectifsSecondaires;

  if (requete.isPending) return <Skeleton hauteur={sizes.anneauForme * 2} />;
  if (requete.isError) return <ErrorState onRetry={requete.refetch} />;

  return (
    <View style={styles.liste}>
      {requete.data.map((slug) => (
        <ChoixOption
          key={slug}
          role="checkbox"
          titre={libelle(slug)}
          selectionne={choisis.includes(slug)}
          onPress={() =>
            modifier({ objectifsSecondaires: choisis.includes(slug) ? choisis.filter((s) => s !== slug) : [...choisis, slug] })
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});

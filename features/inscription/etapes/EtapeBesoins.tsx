import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ChoixOption } from '@/components/ChoixOption';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { sizes, spacing } from '@/theme/tokens';

import { MAX_BESOINS } from '../constantes';
import { useInscription } from '../InscriptionProvider';
import { texteLocal } from '../libelles';
import { useBesoins } from '../useReferentiels';

/** Parcours B, étape 1 : ce que je cherche (2 choix maximum). */
export function EtapeBesoins() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const requete = useBesoins();
  const choisis = reponses.besoins;

  if (requete.isPending) return <Skeleton hauteur={sizes.anneauForme * 2} />;
  if (requete.isError) return <ErrorState onRetry={requete.refetch} />;

  const basculer = (slug: string) => {
    if (choisis.includes(slug)) modifier({ besoins: choisis.filter((s) => s !== slug), sportId: null });
    else if (choisis.length < MAX_BESOINS) modifier({ besoins: [...choisis, slug], sportId: null });
  };

  return (
    <View style={styles.liste}>
      <AppText variant="libelle">{t('inscription.besoins.aide', { count: MAX_BESOINS })}</AppText>
      {requete.data.map((besoin) => (
        <ChoixOption
          key={besoin.slug}
          role="checkbox"
          titre={texteLocal(besoin.libelle)}
          selectionne={choisis.includes(besoin.slug)}
          onPress={() => basculer(besoin.slug)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});

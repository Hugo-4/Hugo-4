import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { EmptyState } from '@/components/EmptyState';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { radius, sizes, spacing } from '@/theme/tokens';

import { age, dateIso } from '../dates';
import { useInscription } from '../InscriptionProvider';
import { libelleReferentiel, texteLocal } from '../libelles';
import { type ParametresRecommandation, useRecommandations } from '../useReferentiels';

/**
 * Parcours B, étape 3 : trois sports recommandés par la base, chacun avec sa raison.
 * Le sport choisi démarre en ambition « plaisir » et niveau « débutant » (docs/ECRANS.md).
 */
export function EtapeRecommandation() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const { besoins, contraintes: c } = reponses;
  const naissance = dateIso(reponses.naissance);
  const parametres: ParametresRecommandation | null =
    c.impactMax && c.encadrement && c.minutesSemaine
      ? {
          besoins,
          impactMax: c.impactMax,
          lieux: c.lieux,
          encadrement: c.encadrement,
          minutesSemaine: c.minutesSemaine,
          age: naissance ? age(naissance) : null,
        }
      : null;
  const recos = useRecommandations(parametres);

  if (recos.isPending) {
    return (
      <View style={styles.liste}>
        {[0, 1, 2].map((i) => (
          <Skeleton key={i} hauteur={sizes.cibleTactile * 2} arrondi={radius.bouton} />
        ))}
      </View>
    );
  }
  if (recos.isError) return <ErrorState onRetry={recos.refetch} />;
  if (recos.data.length === 0) {
    return <EmptyState titre={t('inscription.recommandation.aucunTitre')} texte={t('inscription.recommandation.aucunTexte')} />;
  }

  return (
    <View style={styles.liste} accessibilityRole="radiogroup">
      {recos.data.map((sport) => (
        <ChoixOption
          key={sport.sportId}
          titre={libelleReferentiel('sports', { id: sport.sportId, slug: sport.slug, nom: sport.nom })}
          description={sport.raisons.map(texteLocal).join(' · ')}
          selectionne={reponses.sportId === sport.sportId}
          onPress={() =>
            modifier({ sportId: sport.sportId, ambition: 'plaisir', niveau: 'debutant', objectifSport: null })
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});

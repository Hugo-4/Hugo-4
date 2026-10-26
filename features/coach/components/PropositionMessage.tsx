import type { UseMutationResult } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { CarteModification } from '@/components/CarteModification';
import { useTexteErreur } from '@/lib/texteErreur';
import { colors, spacing } from '@/theme/tokens';

import type { PropositionCoach, ReponseProposition } from '../types';
import { useAnnuler, useAppliquer, useGarder } from '../useActionsProposition';
import { useSecondesRestantes } from '../useSecondesRestantes';

type Action = UseMutationResult<ReponseProposition, Error, string>;

/**
 * Proposition du coach : avant / après / ce qui ne change pas, « Appliquer » ou « Garder l'original ».
 * Une fois appliquée : « Appliqué » et « Annuler (10 s) » tant que la fenêtre d'annulation est ouverte.
 */
export function PropositionMessage({ proposition }: { proposition: PropositionCoach }) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const appliquer = useAppliquer();
  const garder = useGarder();
  const annuler = useAnnuler();
  const restantes = useSecondesRestantes(proposition.statut === 'appliquee' ? proposition.annulable_jusqu_au : null);
  const actions: Action[] = [appliquer, garder, annuler];
  const enCours = actions.some((a) => a.isPending);
  const erreur = actions.find((a) => a.isError)?.error;

  /** Une seule réponse à la fois ; l'erreur affichée est celle de la dernière tentative. */
  const lancer = (action: Action) => {
    if (enCours) return;
    actions.forEach((a) => a.reset());
    action.mutate(proposition.id);
  };

  return (
    <View style={styles.bloc}>
      <CarteModification
        titre={proposition.titre ?? undefined}
        avant={proposition.avant}
        apres={proposition.apres}
        inchange={proposition.inchange}
        etat={proposition.statut}
        annulationRestante={restantes}
        enCours={enCours}
        onAppliquer={() => lancer(appliquer)}
        onGarder={() => lancer(garder)}
        onAnnuler={() => lancer(annuler)}
      />
      {erreur && !enCours ? (
        <AppText variant="secondaire" color={colors.alerte} accessibilityLiveRegion="polite">
          {texteErreur(erreur) ?? t('coach.proposition.erreur')}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

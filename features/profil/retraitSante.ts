import type { QueryClient, QueryKey } from '@tanstack/react-query';

import { CATEGORIES_SANTE, CLES } from '@/features/parametres/constantes';
import type { Souvenir } from '@/features/parametres/types';

import type { EtatConsentement, TypeConsentement } from './types';

type Consentements = Partial<Record<TypeConsentement, EtatConsentement>>;

/** Ce que le cache contenait avant le retrait, pour revenir en arrière si l'enregistrement échoue. */
export type AvantRetrait = { entrees: [QueryKey, unknown][] };

const cleConsentement = (userId: string) => ['consentement', 'donnees_sante', userId];
const cleConsentements = (userId: string) => ['profil', 'consentements', userId];
/** Nutrition lue AVEC le consentement : contient les allergies (useNutrition). */
const NUTRITION_AVEC_SANTE = [...CLES.nutrition, true];

/** Données de santé à effacer du cache dès le retrait (rubrique Santé, nutrition avec allergies). */
function clesASupprimer(): QueryKey[] {
  return [CLES.sante, NUTRITION_AVEC_SANTE];
}

/**
 * Retrait du consentement « données de santé » appliqué tout de suite à toute l'app, avant la réponse :
 * consentement à faux, données de santé supprimées du cache, souvenirs de santé (douleur, antécédents)
 * retirés de la mémoire. Renvoie l'état d'avant pour `restaurerAvantRetrait`.
 */
export async function appliquerRetraitSante(queryClient: QueryClient, userId: string): Promise<AvantRetrait> {
  const concernees: QueryKey[] = [cleConsentement(userId), cleConsentements(userId), CLES.memoire, ...clesASupprimer()];
  await Promise.all(concernees.map((queryKey) => queryClient.cancelQueries({ queryKey })));
  const entrees = concernees.flatMap((queryKey) => queryClient.getQueriesData({ queryKey }));

  queryClient.setQueryData(cleConsentement(userId), false);
  queryClient.setQueryData<Consentements>(cleConsentements(userId), (actuels) =>
    actuels ? { ...actuels, donnees_sante: { accorde: false, le: new Date().toISOString() } } : actuels,
  );
  queryClient.setQueryData<Souvenir[]>(CLES.memoire, (souvenirs) =>
    souvenirs?.filter((s) => !CATEGORIES_SANTE.includes(s.categorie)),
  );
  supprimerDonneesSante(queryClient);
  return { entrees };
}

/** Efface du cache les données de santé (aussi rappelé après la réponse, si une relecture les a ramenées). */
export function supprimerDonneesSante(queryClient: QueryClient) {
  clesASupprimer().forEach((queryKey) => queryClient.removeQueries({ queryKey }));
}

/** L'enregistrement a échoué : le consentement est toujours accordé, le cache revient à l'état d'avant. */
export function restaurerAvantRetrait(queryClient: QueryClient, avant: AvantRetrait) {
  avant.entrees.forEach(([queryKey, valeur]) => {
    if (valeur !== undefined) queryClient.setQueryData(queryKey, valeur);
  });
}

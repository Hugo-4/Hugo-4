import { age } from '@/features/inscription/dates';
import { useIdentite } from '@/features/profil/useProfil';

/** Âge minimal pour voir un classement public (ligues, défis partagés). */
export const AGE_CLASSEMENT_PUBLIC = 15;

/**
 * Le classement public n'est autorisé qu'à partir de 15 ans (âge depuis la date de naissance).
 * Date inconnue, en cours de chargement ou en erreur : non autorisé (prudence).
 */
export function useClassementPublic(): { autorise: boolean; enAttente: boolean } {
  const identite = useIdentite();
  const naissance = identite.data?.dateNaissance;
  return {
    autorise: Boolean(naissance) && age(naissance as string) >= AGE_CLASSEMENT_PUBLIC,
    enAttente: identite.isPending && identite.fetchStatus === 'fetching',
  };
}

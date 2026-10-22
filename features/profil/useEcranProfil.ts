import { useConsentementsAthlete, useIdentite, useSportsAthlete } from './useProfil';

/** Données de l'écran Profil et leurs états (chargement, erreur). */
export function useEcranProfil() {
  const identite = useIdentite();
  const sports = useSportsAthlete();
  const consentements = useConsentementsAthlete();
  const requetes = [identite, sports, consentements];
  return {
    identite: identite.data,
    sports: sports.data ?? [],
    consentements: consentements.data ?? {},
    chargement: requetes.some((r) => r.isPending),
    erreur: requetes.some((r) => r.isError),
    reessayer: () => requetes.forEach((r) => r.refetch()),
  };
}

import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { CLES_PROGRES } from './cles';
import { MOTS_CRITERES_INTERDITS } from './constantes';
import { inscrireLigue, lireChargeSemaines, lireLigues, lireNiveaux, lireRecords, lireRegularite } from './source';

/** Données venant de la source interchangeable (`source.ts`, fictive tant que les routes manquent). */

export function useRecords() {
  return useQuery({ queryKey: CLES_PROGRES.records, queryFn: lireRecords });
}

export function useNiveaux() {
  return useQuery({ queryKey: CLES_PROGRES.niveaux, queryFn: lireNiveaux });
}

export function useChargeSemaines() {
  return useQuery({ queryKey: CLES_PROGRES.chargeSemaines, queryFn: lireChargeSemaines });
}

export function useRegularite() {
  return useQuery({ queryKey: CLES_PROGRES.regularite, queryFn: lireRegularite });
}

/**
 * Critère interdit pour un classement, même si le serveur en renvoyait un (FRONTEND.md §2.6) : le code (slug) contient
 * un mot interdit (« poids_corps », « volume_hebdo », « nb_seances », « minutes »…), quelle que soit la casse.
 */
function critereInterdit(critere: string): boolean {
  const code = critere.toLowerCase();
  return MOTS_CRITERES_INTERDITS.some((mot) => code.includes(mot));
}

/** Ligues et défis : la requête n'est même pas lancée si le classement public n'est pas autorisé (< 15 ans). */
export function useLigues(autorise: boolean) {
  return useQuery({
    queryKey: CLES_PROGRES.ligues,
    queryFn: lireLigues,
    enabled: autorise,
    select: (donnees) => ({
      ...donnees,
      ligues: donnees.autorise ? donnees.ligues.filter((l) => !critereInterdit(l.critere)) : [],
      defis: donnees.autorise ? donnees.defis : [],
    }),
  });
}

export function useInscriptionLigue() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, rejoindre }: { id: string; rejoindre: boolean }) => inscrireLigue(id, rejoindre),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: CLES_PROGRES.ligues }),
  });
}

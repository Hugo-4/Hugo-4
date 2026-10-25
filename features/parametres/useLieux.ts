import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { CLES } from './constantes';
import type { Lieu, SaisieLieu } from './types';

/** GET /lieux : lieux actifs, le lieu par défaut en premier. */
export function useListeLieux() {
  return useQuery({ queryKey: CLES.lieux, queryFn: () => api.get<Lieu[]>('/lieux') });
}

/** Après un changement : lieux du Profil, du check-in (`['lieux', userId]`) et créneaux (noms des lieux). */
function useActualiserLieux() {
  const queryClient = useQueryClient();
  return () =>
    Promise.all([
      queryClient.invalidateQueries({ queryKey: CLES.lieux }),
      queryClient.invalidateQueries({ queryKey: ['lieux'] }),
      queryClient.invalidateQueries({ queryKey: CLES.disponibilites }),
    ]);
}

/** Corps envoyé : la ville n'est envoyée que si elle change (le serveur la re-géocode). */
function corpsLieu(saisie: SaisieLieu, initial: Lieu | null) {
  const ville = saisie.ville.trim() || null;
  const notes = saisie.notes.trim() || null;
  const salleComplete = saisie.type_lieu === 'salle' || saisie.type_lieu === 'club' ? saisie.salle_complete : false;
  return {
    nom: saisie.nom.trim(),
    type_lieu: saisie.type_lieu,
    salle_complete: salleComplete,
    par_defaut: saisie.par_defaut,
    notes,
    ...(!initial || (initial.ville ?? null) !== ville ? { ville } : {}),
  };
}

/** POST /lieux (nouveau) ou PATCH /lieux/:id (modification). Un seul lieu par défaut : le serveur s'en charge. */
export function useEnregistrerLieu() {
  const actualiser = useActualiserLieux();
  return useMutation({
    mutationFn: ({ saisie, initial }: { saisie: SaisieLieu; initial: Lieu | null }) =>
      initial
        ? api.patch<Lieu>(`/lieux/${initial.id}`, corpsLieu(saisie, initial))
        : api.post<Lieu>('/lieux', corpsLieu(saisie, null)),
    onSuccess: actualiser,
  });
}

/** Définit un lieu par défaut depuis la liste. */
export function useLieuParDefaut() {
  const actualiser = useActualiserLieux();
  return useMutation({
    mutationFn: (id: string) => api.patch<Lieu>(`/lieux/${id}`, { par_defaut: true }),
    onSuccess: actualiser,
  });
}

/** DELETE /lieux/:id : le serveur désactive le lieu (il n'est plus proposé). */
export function useSupprimerLieu() {
  const actualiser = useActualiserLieux();
  return useMutation({
    mutationFn: (id: string) => api.delete<{ id: string }>(`/lieux/${id}`),
    onSuccess: actualiser,
  });
}

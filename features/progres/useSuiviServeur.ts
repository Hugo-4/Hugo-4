import { useQuery } from '@tanstack/react-query';

import { api } from '@/lib/api';

import { CLES_PROGRES } from './cles';
import type { Assiduite, ProfilAvance, Progression } from './types';

/** `GET /progressions` : 1RM estimé et tendance par exercice, calculés par le serveur. */
export function useProgressions() {
  return useQuery({
    queryKey: CLES_PROGRES.progressions,
    queryFn: async () => (await api.get<Progression[]>('/progressions')) ?? [],
  });
}

/** `GET /profil` → `charge` : ACWR, zone, monotonie (décisions du serveur, affichées telles quelles). */
export function useChargeActuelle() {
  return useQuery({
    queryKey: CLES_PROGRES.chargeActuelle,
    queryFn: () => api.get<ProfilAvance>('/profil'),
    select: (profil) => profil?.charge ?? null,
  });
}

/** `GET /assiduite` : séances faites sur 14/28/56 jours. */
export function useAssiduite() {
  return useQuery({ queryKey: CLES_PROGRES.assiduite, queryFn: () => api.get<Assiduite>('/assiduite') });
}

import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';

import { api } from '@/lib/api';

import type { Accueil } from './types';

type EvenementListe = { id: string; nom: string; date_evenement: string; statut: string };

/**
 * `GET /accueil` ne renvoie pas l'identifiant du prochain objectif (manque signalé au serveur) :
 * on le retrouve dans `GET /evenements` (même nom, même date) pour ouvrir la compétition ;
 * à défaut, on ouvre l'onglet Programme.
 */
export function useOuvrirEvenement() {
  const queryClient = useQueryClient();
  return async (evenement: NonNullable<Accueil['prochain_evenement']>) => {
    try {
      const liste = await queryClient.fetchQuery({
        queryKey: ['evenements', 'accueil'],
        queryFn: () => api.get<EvenementListe[]>('/evenements'),
        staleTime: 60_000,
      });
      const trouve = liste.find((e) => e.nom === evenement.nom && e.date_evenement === evenement.date && e.statut !== 'annule');
      if (trouve) {
        router.push({ pathname: '/programme/evenement/[id]', params: { id: trouve.id } });
        return;
      }
    } catch {
      // Hors ligne ou erreur : on se rabat sur l'onglet Programme.
    }
    router.navigate('/programme');
  };
}

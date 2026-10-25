import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';

import { cleCredits } from './cles';
import { source } from './source';
import type { CreditsCoach } from './types';

/** En dessous de cette part du total, une ligne discrète signale les crédits restants (ECRANS.md §3). */
const SEUIL_CREDITS_BAS = 0.2;

export function creditsBas(credits: CreditsCoach): boolean {
  return credits.total > 0 && credits.restant > 0 && credits.restant / credits.total < SEUIL_CREDITS_BAS;
}

export function creditsEpuises(credits: CreditsCoach | undefined): boolean {
  return credits !== undefined && credits.restant <= 0;
}

/** Solde de crédits du mois (le serveur décompte ; l'app affiche). */
export function useCredits() {
  const { session } = useSession();
  const userId = session?.user.id;
  return useQuery({
    queryKey: cleCredits(userId),
    enabled: Boolean(userId),
    queryFn: () => source.lireCredits(),
  });
}

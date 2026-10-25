import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { useConsentementSante } from '@/features/checkin/useConsentementSante';
import { supabase } from '@/lib/supabase';

import { CLES } from './constantes';

/** `user_profiles.blessures_actives` : objets `{ zone, type, depuis }` ou simples textes (anciens profils). */
export type BlessureActive = { zone: string | null; type: string | null; depuis: string | null };

export type Reeducation = {
  id: string;
  blessure_type: string | null;
  zone_anatomique: string | null;
  cote: string | null;
  gravite: string | null;
  phase_actuelle: number | null;
  date_debut_protocole: string | null;
};

export type DonneesSante = { blessures: BlessureActive[]; reeducations: Reeducation[] };

function lireBlessure(brute: unknown): BlessureActive {
  if (typeof brute === 'string') return { zone: null, type: brute, depuis: null };
  const b = (brute ?? {}) as Record<string, unknown>;
  const texte = (v: unknown) => (typeof v === 'string' && v.trim() ? v : null);
  return { zone: texte(b.zone), type: texte(b.type), depuis: texte(b.depuis) };
}

/**
 * Blessures actives et rééducation en cours. Aucune lecture sans le consentement « données de santé » :
 * la requête n'est activée que s'il est accordé (et son cache est supprimé dès qu'il est retiré).
 */
export function useSante() {
  const { session } = useSession();
  const userId = session?.user.id;
  const consentement = useConsentementSante();
  const autorise = consentement.data === true;
  const requete = useQuery({
    queryKey: [...CLES.sante, userId],
    enabled: Boolean(userId) && autorise,
    queryFn: async (): Promise<DonneesSante> => {
      const [profil, reeducation] = await Promise.all([
        supabase.from('user_profiles').select('blessures_actives').eq('user_id', userId as string).maybeSingle(),
        supabase
          .from('user_reeducation')
          .select('id, blessure_type, zone_anatomique, cote, gravite, phase_actuelle, date_debut_protocole')
          .eq('user_id', userId as string)
          .eq('statut', 'actif')
          .order('created_at', { ascending: false }),
      ]);
      if (profil.error) throw profil.error;
      if (reeducation.error) throw reeducation.error;
      const brutes = profil.data?.blessures_actives;
      return {
        blessures: (Array.isArray(brutes) ? brutes : []).map(lireBlessure),
        reeducations: (reeducation.data ?? []) as Reeducation[],
      };
    },
  });
  return { consentement, autorise, requete };
}

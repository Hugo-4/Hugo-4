import { supabase } from '@/lib/supabase';

/** Lève l'erreur Supabase s'il y en a une, sinon renvoie le résultat. */
export async function verifier<T extends { error: unknown }>(requete: PromiseLike<T>): Promise<T> {
  const resultat = await requete;
  if (resultat.error) throw resultat.error;
  return resultat;
}

/** Ligne `user_sport_profiles` du sport, mise à jour si elle existe déjà, créée sinon. */
export async function enregistrerSport(userId: string, sportId: string, valeurs: Record<string, unknown>) {
  const { data } = await verifier(
    supabase.from('user_sport_profiles').select('id').eq('user_id', userId).eq('sport_id', sportId).limit(1),
  );
  const existante = (data as { id: string }[] | null)?.[0];
  await verifier(
    existante
      ? supabase.from('user_sport_profiles').update(valeurs).eq('id', existante.id).eq('user_id', userId)
      : supabase.from('user_sport_profiles').insert({ user_id: userId, sport_id: sportId, ...valeurs }),
  );
}

/** Style de coaching fusionné avec les valeurs existantes (tutoiement, émojis, motivations). */
export async function styleCoaching(userId: string, choix: { ton: string; longueur: string }) {
  const { data } = await verifier(
    supabase.from('user_profiles').select('style_coaching').eq('user_id', userId).maybeSingle(),
  );
  const actuel = (data as { style_coaching?: Record<string, unknown> } | null)?.style_coaching ?? {};
  return { ...actuel, ...choix };
}

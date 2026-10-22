import { supabase } from '@/lib/supabase';

import { dateIso } from './dates';
import { nombreSaisi } from './etapes';
import type { Reponses } from './types';

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

/**
 * Pont avec le générateur actuel du serveur, qui lit encore `objectif_id` (objectifs_entrainement) :
 * la qualité principale de l'objectif précis (`objectifs_sport.qualite_principale`, définie en base).
 * Jamais affichée à l'athlète.
 */
export async function objectifEntrainementId(slug: string | null): Promise<string | null> {
  if (!slug) return null;
  const { data } = await verifier(supabase.from('objectifs_entrainement').select('id').eq('slug', slug).maybeSingle());
  return (data as { id: string } | null)?.id ?? null;
}

/**
 * `user_sport_profiles.echeance` (format documenté dans docs/API.md) :
 * { date?, epreuve?, distance?, categorie_poids_kg?, poste? }.
 */
export function echeanceJson(r: Reponses): Record<string, unknown> {
  const o = r.objectifSport;
  if (!o) return {};
  const json: Record<string, unknown> = {};
  if (o.echeanceRequise) {
    json.date = dateIso(r.echeance.date);
    json.epreuve = r.echeance.epreuve.trim();
  }
  if (o.precisionDemandee === 'categorie_poids') json.categorie_poids_kg = nombreSaisi(r.echeance.precision);
  else if (o.precisionDemandee) json[o.precisionDemandee] = r.echeance.precision.trim();
  return json;
}

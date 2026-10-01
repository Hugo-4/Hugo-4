import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

import { dateIso } from './dates';
import { nombreSaisi } from './etapes';
import type { Parcours, Reponses } from './types';

type Contexte = {
  userId: string;
  parcours: Parcours;
  consentementSante: boolean;
  reponses: Reponses;
  langue: string;
  /** Libellé du lieu principal, dans la langue de l'athlète. */
  nomLieu: string;
};

type Partie = { nom: string; executer: (c: Contexte) => Promise<unknown> };

async function verifier<T extends { error: unknown }>(requete: PromiseLike<T>): Promise<T> {
  const resultat = await requete;
  if (resultat.error) throw resultat.error;
  return resultat;
}

/** Ligne `user_sport_profiles` du sport, mise à jour si elle existe déjà, créée sinon. */
async function enregistrerSport(userId: string, sportId: string, valeurs: Record<string, unknown>) {
  const { data } = await verifier(
    supabase.from('user_sport_profiles').select('id').eq('user_id', userId).eq('sport_id', sportId).limit(1),
  );
  const existante = (data as { id: string }[] | null)?.[0];
  await verifier(
    existante
      ? supabase.from('user_sport_profiles').update(valeurs).eq('id', existante.id)
      : supabase.from('user_sport_profiles').insert({ user_id: userId, sport_id: sportId, ...valeurs }),
  );
}

/**
 * Parties de l'enregistrement, dans l'ordre. Les parties qui ajoutent des lignes
 * (douleurs, lieu, compétition) viennent en dernier et ne sont jamais rejouées.
 */
export const PARTIES: Partie[] = [
  {
    nom: 'identite',
    executer: ({ userId, reponses, langue }) =>
      verifier(supabase.from('users').update({ prenom: reponses.prenom.trim(), langue }).eq('id', userId)),
  },
  {
    nom: 'profil',
    executer: ({ userId, parcours, reponses: r }) =>
      verifier(
        supabase
          .from('user_profiles')
          .update({
            date_naissance: dateIso(r.naissance),
            niveau_general: r.niveau,
            sport_principal_id: r.sportId,
            seances_par_semaine: r.jours.length,
            duree_seance_minutes: r.dureeMin,
            moment_prefere: r.creneau,
            ...(parcours === 'complet'
              ? { sexe: r.sexe, taille_cm: Math.round(nombreSaisi(r.tailleCm) ?? 0), poids_kg: nombreSaisi(r.poidsKg) }
              : {}),
          })
          .eq('user_id', userId),
      ),
  },
  {
    nom: 'sports',
    executer: async ({ userId, reponses: r }) => {
      await enregistrerSport(userId, r.sportId as string, {
        role: 'principal',
        priorite: 1,
        niveau: r.niveau,
        objectif_id: r.objectifId,
        seances_semaine_cible: r.jours.length,
        actif: true,
      });
      for (const [i, sportId] of r.sportsSecondaires.entries()) {
        await enregistrerSport(userId, sportId, { role: 'complementaire', priorite: i + 2, actif: true });
      }
    },
  },
  {
    nom: 'disponibilites',
    executer: ({ reponses: r }) =>
      api.put('/disponibilites', {
        creneaux: r.jours.map((jour) => ({ jour, creneau: r.creneau, duree_max_min: r.dureeMin })),
      }),
  },
  {
    nom: 'preferences',
    executer: ({ parcours, reponses: r }) =>
      parcours === 'complet'
        ? api.patch('/preferences', {
            style_coaching: { ton: r.ton, longueur: r.longueur, tutoiement: true, emojis: false, motivations: [] },
          })
        : Promise.resolve(),
  },
  {
    nom: 'douleurs',
    executer: ({ userId, consentementSante, reponses: r }) =>
      consentementSante && !r.aucuneDouleur && r.douleurs.length > 0
        ? verifier(
            supabase.from('blessures').insert(
              r.douleurs.map((d) => ({
                user_id: userId,
                type: d.nature,
                zone: d.zone,
                cote: d.cote,
                gravite: d.gravite,
                statut: 'active',
                source: 'onboarding',
              })),
            ),
          )
        : Promise.resolve(),
  },
  {
    nom: 'lieu',
    executer: ({ userId, parcours, reponses: r, nomLieu }) =>
      parcours === 'complet' && r.lieu
        ? verifier(
            supabase.from('lieux_athlete').insert({
              user_id: userId,
              nom: nomLieu,
              type_lieu: r.lieu,
              environnement: r.lieu,
              salle_complete: r.lieu === 'salle',
              par_defaut: true,
            }),
          )
        : Promise.resolve(),
  },
  {
    nom: 'competition',
    executer: ({ parcours, reponses: r }) =>
      parcours === 'complet' && r.competition.prevue
        ? api.post('/evenements', {
            nom: r.competition.nom.trim(),
            date_evenement: dateIso(r.competition.date),
            priorite: 'A',
            type_evenement: r.competition.type,
          })
        : Promise.resolve(),
  },
];

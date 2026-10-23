import { supabase } from '@/lib/supabase';

import { PARTIES_AJOUTS } from './enregistrementAjouts';
import {
  echeanceJson,
  enregistrerSport,
  objectifEntrainementId,
  styleCoaching,
  verifier,
} from './enregistrementOutils';
import { dateIso } from './dates';
import { nombreSaisi } from './etapes';
import type { Parcours, Reponses } from './types';

export type Contexte = {
  userId: string;
  parcours: Parcours;
  consentementSante: boolean;
  reponses: Reponses;
  langue: string;
  /** Libellé du lieu principal, dans la langue de l'athlète. */
  nomLieu: string;
};

export type Partie = { nom: string; executer: (c: Contexte) => Promise<unknown> };

/**
 * Parties de l'enregistrement, dans l'ordre. Toutes passent par Supabase avec la session
 * de l'athlète (RLS) et filtrent sur son identifiant. Les parties qui ajoutent des lignes
 * (douleurs, lieu, compétition) viennent en dernier (enregistrementAjouts.ts).
 */
export const PARTIES: Partie[] = [
  {
    nom: 'identite',
    executer: ({ userId, reponses, langue }) =>
      verifier(supabase.from('users').update({ prenom: reponses.prenom.trim(), langue }).eq('id', userId)),
  },
  {
    nom: 'profil',
    executer: async ({ userId, parcours, reponses: r }) =>
      verifier(
        supabase
          .from('user_profiles')
          .update({
            date_naissance: dateIso(r.naissance),
            pays: r.pays,
            niveau_general: r.niveau,
            sport_principal_id: r.sportId,
            seances_par_semaine: r.jours.length,
            duree_seance_minutes: r.dureeMin,
            moment_prefere: r.creneau,
            ...(parcours === 'complet'
              ? { sexe: r.sexe, taille_cm: Math.round(nombreSaisi(r.tailleCm) ?? 0), poids_kg: nombreSaisi(r.poidsKg) }
              : {}),
            ...(parcours === 'complet' && r.ton && r.longueur
              ? { style_coaching: await styleCoaching(userId, { ton: r.ton, longueur: r.longueur }) }
              : {}),
          })
          .eq('user_id', userId),
      ),
  },
  {
    nom: 'sports',
    executer: async ({ userId, reponses: r }) => {
      const principal = r.sportId as string;
      // `cadre_pratique` est déduit de l'ambition par la base (déclencheur cadre_depuis_ambition).
      await enregistrerSport(userId, principal, {
        role: 'principal',
        priorite: 1,
        niveau: r.niveau,
        ambition: r.ambition,
        objectif_sport_id: r.objectifSport?.id ?? null,
        objectif_id: await objectifEntrainementId(r.objectifSport?.qualitePrincipale ?? null),
        echeance: echeanceJson(r),
        objectifs_secondaires: r.objectifsSecondaires,
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
    executer: async ({ userId, reponses: r }) => {
      // Remplace tous les créneaux de l'athlète (une ligne par jour et par moment).
      await verifier(supabase.from('disponibilites_athlete').delete().eq('user_id', userId));
      await verifier(
        supabase.from('disponibilites_athlete').insert(
          r.jours.map((jour) => ({ user_id: userId, jour, creneau: r.creneau, duree_max_min: r.dureeMin, actif: true })),
        ),
      );
    },
  },
  ...PARTIES_AJOUTS,
];


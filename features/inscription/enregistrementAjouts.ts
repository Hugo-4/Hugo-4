import { supabase } from '@/lib/supabase';

import { dateIso } from './dates';
import { nombreSaisi } from './etapes';
import type { Partie } from './enregistrement';
import { existeDeja, verifier } from './enregistrementOutils';

/**
 * Parties qui ajoutent des lignes. Chacune vérifie d'abord ce qui existe déjà :
 * relancer l'inscription (ou l'app) ne crée pas de doublon.
 */
export const PARTIES_AJOUTS: Partie[] = [
  {
    nom: 'douleurs',
    executer: async ({ userId, consentementSante, reponses: r }) =>
      consentementSante &&
      !r.aucuneDouleur &&
      r.douleurs.length > 0 &&
      !(await existeDeja(supabase.from('blessures').select('id').eq('user_id', userId).eq('source', 'onboarding').limit(1)))
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
    executer: async ({ userId, parcours, reponses: r, nomLieu }) =>
      parcours === 'complet' &&
      r.lieu &&
      !(await existeDeja(supabase.from('lieux_athlete').select('id').eq('user_id', userId).eq('par_defaut', true).limit(1)))
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
    executer: async ({ userId, parcours, reponses: r }) => {
      // Échéance de l'objectif précis, sinon compétition saisie au parcours Complet : objectif A du programme.
      const echeance = r.objectifSport?.echeanceRequise ? dateIso(r.echeance.date) : null;
      const saisie = parcours === 'complet' && r.competition.prevue && !echeance;
      if (!echeance && !saisie) return;
      const poids = echeance && r.objectifSport?.precisionDemandee === 'categorie_poids' ? nombreSaisi(r.echeance.precision) : null;
      const valeurs = {
        sport_id: r.sportId,
        nom: echeance ? r.echeance.epreuve.trim() : r.competition.nom.trim(),
        date_evenement: echeance ?? dateIso(r.competition.date),
        priorite: 'A',
        type_evenement: echeance ? 'competition' : r.competition.type,
        statut: 'prevu',
        // Catégorie de poids de l'échéance (sports de combat) recopiée sur l'événement.
        ...(poids !== null ? { categorie_poids_kg: poids } : {}),
      };
      // Un seul objectif A prévu par sport : chaque passage du questionnaire met à jour l'existant.
      const { data } = await verifier(
        supabase
          .from('evenements_athlete')
          .select('id')
          .eq('user_id', userId)
          .eq('sport_id', r.sportId as string)
          .eq('priorite', 'A')
          .eq('statut', 'prevu')
          .order('created_at', { ascending: false })
          .limit(1),
      );
      const existant = (data as { id: string }[] | null)?.[0];
      await verifier(
        existant
          ? supabase.from('evenements_athlete').update(valeurs).eq('id', existant.id).eq('user_id', userId)
          : supabase.from('evenements_athlete').insert({ user_id: userId, ...valeurs }),
      );
    },
  },
];

import i18n from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

import type { DemandeMessage } from '../types';
import type { Bilingue } from './reponsesFictives';

/**
 * DONNÉES FICTIVES — tant que `POST /coach/messages` n'existe pas, la source fictive fait ce que fera le serveur :
 * enregistrer dans `sous_objectifs` des étapes « proposées » par le coach (RLS : lignes de l'athlète), à accepter,
 * modifier ou refuser dans Programme. Le vrai coach les construit à partir des tests et de la doctrine.
 */
const ETAPES: { part: number; type: 'performance' | 'competition'; titre: Bilingue; raison: Bilingue }[] = [
  {
    part: 0.25,
    type: 'performance',
    titre: { fr: 'Bilan : refaire tes tests de référence', en: 'Check-in: redo your reference tests' },
    raison: { fr: 'Mesurer ton point de départ réel pour régler les charges.', en: 'Measure your real starting point to set the loads.' },
  },
  {
    part: 0.5,
    type: 'performance',
    titre: { fr: 'Mi-parcours : +5 % sur tes valeurs clés', en: 'Halfway: +5% on your key numbers' },
    raison: { fr: 'Une progression régulière, sans brûler les étapes.', en: 'Steady progress without rushing.' },
  },
  {
    part: 0.8,
    type: 'competition',
    titre: { fr: 'Répétition générale : simulation de compétition', en: 'Dress rehearsal: competition simulation' },
    raison: { fr: 'Tester le rythme, le matériel et la récupération en conditions réelles.', en: 'Test pace, kit and recovery in real conditions.' },
  },
];

const iso = (d: Date) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

export async function proposerEtapesFictives(demande: DemandeMessage) {
  const { data } = await supabase.auth.getSession();
  const userId = data.session?.user.id;
  if (!userId) return;
  const contexte = demande.contexte && 'sujet' in demande.contexte ? demande.contexte : null;
  const evenement = contexte?.evenement_id
    ? (await supabase.from('evenements_athlete').select('id, date_evenement, sport_id').eq('id', contexte.evenement_id).eq('user_id', userId).maybeSingle()).data
    : null;
  const debut = new Date();
  const fin = evenement ? new Date(`${evenement.date_evenement}T12:00:00`) : new Date(debut.getTime() + 182 * 864e5);
  const duree = Math.max(fin.getTime() - debut.getTime(), 28 * 864e5);
  const langue = i18n.language.startsWith('en') ? 'en' : 'fr';
  await supabase.from('sous_objectifs').insert(
    ETAPES.map((e) => ({
      user_id: userId,
      sport_id: evenement?.sport_id ?? null,
      evenement_id: evenement?.id ?? null,
      titre: e.titre[langue],
      raison: e.raison[langue],
      type: e.type,
      date_cible: iso(new Date(debut.getTime() + duree * e.part)),
      statut: 'propose',
      origine: 'coach',
    })),
  );
}

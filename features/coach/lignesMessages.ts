import { type ActionApp, lireActionApp } from './actionsApp';
import type { Avis, MessageConversation, PropositionCoach, StatutProposition } from './types';

/**
 * Lecture d'une ligne `messages_coach` (format attendu de la colonne `actions` : docs/MANQUES-SERVEUR.md §3) :
 *   actions = [{ type: 'proposition', id, titre, avant[], apres[], inchange[], statut, annulable_jusqu_au },
 *              { type: 'urgence' }, { type: 'langue', langue: 'en' }, { type: 'ouvrir', ecran: 'abonnement' }]
 * Une ligne mal formée est ignorée plutôt que de casser l'écran.
 */

type Ligne = {
  id?: unknown;
  role?: unknown;
  contenu?: unknown;
  avis?: unknown;
  actions?: unknown;
  created_at?: unknown;
};

const STATUTS: StatutProposition[] = ['proposee', 'appliquee', 'gardee'];

const textes = (valeur: unknown): string[] =>
  Array.isArray(valeur) ? valeur.filter((x): x is string => typeof x === 'string') : [];

const estObjet = (valeur: unknown): valeur is Record<string, unknown> =>
  typeof valeur === 'object' && valeur !== null;

function lireProposition(action: Record<string, unknown>): PropositionCoach | null {
  const statut = STATUTS.find((s) => s === action.statut);
  if (typeof action.id !== 'string' || !statut) return null;
  return {
    id: action.id,
    titre: typeof action.titre === 'string' ? action.titre : null,
    avant: textes(action.avant),
    apres: textes(action.apres),
    inchange: textes(action.inchange),
    statut,
    annulable_jusqu_au: typeof action.annulable_jusqu_au === 'string' ? action.annulable_jusqu_au : null,
  };
}

export function versMessage(ligne: Ligne): MessageConversation | null {
  if (typeof ligne.id !== 'string' || typeof ligne.contenu !== 'string') return null;
  if (ligne.role !== 'athlete' && ligne.role !== 'coach') return null;
  const actions = Array.isArray(ligne.actions) ? ligne.actions.filter(estObjet) : [];
  const brute = actions.find((a) => a.type === 'proposition');
  const avis: Avis = ligne.avis === 1 || ligne.avis === -1 ? ligne.avis : null;
  return {
    id: ligne.id,
    role: ligne.role,
    contenu: ligne.contenu,
    created_at: typeof ligne.created_at === 'string' ? ligne.created_at : '',
    avis,
    proposition: brute ? lireProposition(brute) : null,
    urgence: actions.some((a) => a.type === 'urgence'),
    actionsApp: actions.map(lireActionApp).filter((a): a is ActionApp => a !== null),
  };
}

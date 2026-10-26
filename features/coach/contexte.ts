import type { ContexteCoach } from './ouvrirCoach';
import type { ContexteMessage } from './types';

/** Texte de la puce « Sur : … » (titre de la séance ou nom de l'exercice, tels que reçus du serveur). */
export function libelleContexte(contexte: ContexteCoach): string {
  return contexte.type === 'exercice' ? contexte.nom : contexte.titre;
}

/** Contexte envoyé au serveur avec chaque message (identifiants seulement). */
export function versContexteMessage(contexte: ContexteCoach | null): ContexteMessage | null {
  if (!contexte) return null;
  if (contexte.type === 'objectif') return { sujet: 'objectif', ...(contexte.evenementId ? { evenement_id: contexte.evenementId } : {}) };
  return contexte.type === 'exercice'
    ? { programme_seance_id: contexte.programmeSeanceId, exercice_slug: contexte.exerciceSlug }
    : { programme_seance_id: contexte.programmeSeanceId };
}

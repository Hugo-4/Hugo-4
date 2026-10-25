import type { ContexteCoach } from './ouvrirCoach';
import type { ContexteMessage } from './types';

/** Texte de la puce « Sur : … » (titre de la séance ou nom de l'exercice, tels que reçus du serveur). */
export function libelleContexte(contexte: ContexteCoach): string {
  return contexte.type === 'seance' ? contexte.titre : contexte.nom;
}

/** Contexte envoyé au serveur avec chaque message (identifiants seulement). */
export function versContexteMessage(contexte: ContexteCoach | null): ContexteMessage | null {
  if (!contexte) return null;
  return contexte.type === 'exercice'
    ? { programme_seance_id: contexte.programmeSeanceId, exercice_slug: contexte.exerciceSlug }
    : { programme_seance_id: contexte.programmeSeanceId };
}

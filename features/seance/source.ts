import { api } from '@/lib/api';

import type { EntreeEnvoi } from './fileEnvoi';
import { PREFIXE_FICTIF, seanceFictive } from './mockSeance';
import type { SeanceDemarree, SerieSuivante } from './types';

/**
 * Accès au serveur pour la séance. Tant que `POST /programme/seances/:id/demarrer` n'existe pas,
 * la séance est fictive (même format) : passer `SEANCE_FICTIVE` à false quand la route est en ligne.
 */
export const SEANCE_FICTIVE = true;

const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Crée (ou reprend) la séance finale du jour et renvoie ses exercices avec leurs identifiants. */
export async function demarrerSeance(programmeSeanceId: string): Promise<SeanceDemarree> {
  if (SEANCE_FICTIVE) {
    await attendre(400);
    return seanceFictive(programmeSeanceId);
  }
  return api.post<SeanceDemarree>(`/programme/seances/${programmeSeanceId}/demarrer`, undefined, { delaiMs: 90_000 });
}

/** Envoie une entrée de la file (séries d'un exercice ou retour de fin de séance). */
export async function envoyerEntree(entree: EntreeEnvoi): Promise<void> {
  if (entree.chemin.includes(PREFIXE_FICTIF)) {
    await attendre(300);
    return;
  }
  const options = { entetes: { 'Idempotency-Key': entree.id }, delaiMs: 20_000 };
  if (entree.methode === 'PUT') await api.put(entree.chemin, entree.corps, options);
  else await api.post(entree.chemin, entree.corps, options);
}

/** Charge conseillée pour la série suivante (calcul du serveur). `null` si hors ligne. */
export async function serieSuivante(corps: {
  charge_kg: number;
  reps: number;
  rpe: number;
  reps_cible: number | string | null;
  rpe_cible: number | null;
}): Promise<SerieSuivante | null> {
  try {
    return await api.post<SerieSuivante>('/serie-suivante', corps, { delaiMs: 8_000 });
  } catch {
    return null;
  }
}

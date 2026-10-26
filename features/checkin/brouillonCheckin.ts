import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SaisieCheckin } from './types';

/**
 * Brouillon du check-in du jour : rien n'est perdu si la feuille se ferme ou si l'envoi échoue.
 * Une clé par compte (`athlenis.brouillonCheckin.v1.<userId>`) : un autre compte sur le même téléphone ne le voit
 * jamais, et la déconnexion efface tous les brouillons (`effacerTousLesBrouillons`).
 */
export const PREFIXE_BROUILLON = 'athlenis.brouillonCheckin.v1.';

const cle = (userId: string) => `${PREFIXE_BROUILLON}${userId}`;

type Brouillon = { date: string; saisie: SaisieCheckin };

/** Brouillon du jour donné, ou `null` (un brouillon d'un autre jour est ignoré). */
export async function lireBrouillon(userId: string, date: string): Promise<SaisieCheckin | null> {
  try {
    const brut = await AsyncStorage.getItem(cle(userId));
    if (!brut) return null;
    const brouillon = JSON.parse(brut) as Brouillon;
    return brouillon.date === date ? brouillon.saisie : null;
  } catch {
    return null;
  }
}

export function enregistrerBrouillon(userId: string, date: string, saisie: SaisieCheckin) {
  return AsyncStorage.setItem(cle(userId), JSON.stringify({ date, saisie } satisfies Brouillon)).catch(() => undefined);
}

export function effacerBrouillon(userId: string) {
  return AsyncStorage.removeItem(cle(userId)).catch(() => undefined);
}

/** Déconnexion ou suppression du compte : plus aucun brouillon sur le téléphone. */
export async function effacerTousLesBrouillons(): Promise<void> {
  const cles = await AsyncStorage.getAllKeys().catch(() => [] as readonly string[]);
  const aEffacer = cles.filter((c) => c.startsWith(PREFIXE_BROUILLON));
  if (aEffacer.length) await AsyncStorage.multiRemove(aEffacer).catch(() => undefined);
}

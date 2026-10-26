import AsyncStorage from '@react-native-async-storage/async-storage';

import type { SaisieCheckin } from './types';

/** Brouillon du check-in du jour : rien n'est perdu si la feuille se ferme ou si l'envoi échoue. */
const CLE_BROUILLON = 'athlenis.brouillonCheckin.v1';

type Brouillon = { date: string; saisie: SaisieCheckin };

/** Brouillon du jour donné, ou `null` (un brouillon d'un autre jour est ignoré). */
export async function lireBrouillon(date: string): Promise<SaisieCheckin | null> {
  try {
    const brut = await AsyncStorage.getItem(CLE_BROUILLON);
    if (!brut) return null;
    const brouillon = JSON.parse(brut) as Brouillon;
    return brouillon.date === date ? brouillon.saisie : null;
  } catch {
    return null;
  }
}

export function enregistrerBrouillon(date: string, saisie: SaisieCheckin) {
  return AsyncStorage.setItem(CLE_BROUILLON, JSON.stringify({ date, saisie } satisfies Brouillon)).catch(() => undefined);
}

export function effacerBrouillon() {
  return AsyncStorage.removeItem(CLE_BROUILLON).catch(() => undefined);
}

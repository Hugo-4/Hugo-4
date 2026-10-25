import AsyncStorage from '@react-native-async-storage/async-storage';

import type { EtatSeance } from './etat';
import type { Vue } from './types';

/** Séance en cours sauvegardée sur le téléphone : l'app peut être fermée, la séance reprend. */
const CLE_SEANCE = 'athlenis.seanceEnCours.v1';
const CLE_VUE = 'athlenis.seanceVue.v1';

export async function lireSeanceEnCours(): Promise<EtatSeance | null> {
  try {
    const brut = await AsyncStorage.getItem(CLE_SEANCE);
    return brut ? (JSON.parse(brut) as EtatSeance) : null;
  } catch {
    return null;
  }
}

export function sauverSeanceEnCours(etat: EtatSeance): Promise<void> {
  return AsyncStorage.setItem(CLE_SEANCE, JSON.stringify(etat));
}

export function effacerSeanceEnCours(): Promise<void> {
  return AsyncStorage.removeItem(CLE_SEANCE);
}

/** Choix « Exercice » / « Toute la séance », gardé pour les séances suivantes. */
export async function lireVue(): Promise<Vue> {
  const v = await AsyncStorage.getItem(CLE_VUE).catch(() => null);
  return v === 'liste' ? 'liste' : 'exercice';
}

export function sauverVue(vue: Vue): Promise<void> {
  return AsyncStorage.setItem(CLE_VUE, vue);
}

import { api } from '@/lib/api';

import { niveauxFictifs, recordsFictifs } from './mockProgres';
import { chargeSemainesFictive, inscrireLigueFictive, liguesFictives, regulariteFictive } from './mockSuivi';
import type { ChargeSemaines, LiguesDefis, Niveaux, RecordJalon, Regularite } from './types';

/**
 * Accès au serveur pour ce qui manque encore côté coachia-agents-v6 (docs/MANQUES-SERVEUR.md §5) :
 * records et jalons, niveaux en percentile, charge par semaine, régularité, ligues et défis.
 * Tant que ces routes n'existent pas, les données sont fictives (même format) :
 * passer `PROGRES_FICTIF` à false quand les routes sont en ligne, rien d'autre ne change.
 * Les routes qui existent déjà (tests, progressions, assiduité, profil) sont toujours appelées en vrai.
 */
export const PROGRES_FICTIF = true;

/** Nombre de semaines affichées pour la charge et la régularité. */
export const SEMAINES_AFFICHEES = 12;

const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

async function fictif<T>(donnees: () => T): Promise<T> {
  await attendre(350);
  return donnees();
}

/** Records et jalons (faits réels datés), du plus récent au plus ancien. */
export function lireRecords(): Promise<RecordJalon[]> {
  if (PROGRES_FICTIF) return fictif(recordsFictifs);
  return api.get<RecordJalon[]>('/progres/records');
}

/** Niveau par qualité en percentile, chacun avec son groupe de comparaison. */
export function lireNiveaux(): Promise<Niveaux> {
  if (PROGRES_FICTIF) return fictif(niveauxFictifs);
  return api.get<Niveaux>('/progres/niveaux');
}

/** Charge par semaine et zone optimale de la semaine en cours (calculées par le serveur). */
export function lireChargeSemaines(): Promise<ChargeSemaines> {
  if (PROGRES_FICTIF) return fictif(chargeSemainesFictive);
  return api.get<ChargeSemaines>(`/progres/charge?semaines=${SEMAINES_AFFICHEES}`);
}

/** Semaines réussies et série en cours. */
export function lireRegularite(): Promise<Regularite> {
  if (PROGRES_FICTIF) return fictif(regulariteFictive);
  return api.get<Regularite>(`/progres/regularite?semaines=${SEMAINES_AFFICHEES}`);
}

/** Ligues et défis : le serveur répond `autorise: false` avant 15 ans. */
export function lireLigues(): Promise<LiguesDefis> {
  if (PROGRES_FICTIF) return fictif(liguesFictives);
  return api.get<LiguesDefis>('/progres/ligues');
}

/** Rejoindre ou quitter une ligue (les ligues sont au choix). */
export async function inscrireLigue(id: string, rejoindre: boolean): Promise<void> {
  if (PROGRES_FICTIF) {
    await attendre(300);
    inscrireLigueFictive(id, rejoindre);
    return;
  }
  await api.post(`/progres/ligues/${id}/${rejoindre ? 'rejoindre' : 'quitter'}`);
}

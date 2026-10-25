import { api } from '@/lib/api';

import {
  creditsFictifs,
  demanderExportFictif,
  lireExportFictif,
  lireNutritionFictive,
  modifierNutritionFictive,
} from './mockParametres';
import type { Credits, ExportDonnees, Offre, PreferencesNutrition } from './types';

/**
 * Routes du Profil qui n'existent pas encore côté serveur (docs/MANQUES-SERVEUR.md §6) : crédits du mois,
 * export des données, suppression du compte, préférences de nutrition. Tant qu'elles manquent, les
 * données sont fictives (même format) : passer `PARAMETRES_FICTIF` à false quand elles sont en ligne.
 */
export const PARAMETRES_FICTIF = true;

const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/** Crédits du mois en cours. `offre` ne sert qu'à la source fictive (le serveur la connaît). */
export async function lireCredits(offre: Offre): Promise<Credits> {
  if (PARAMETRES_FICTIF) {
    await attendre(300);
    return creditsFictifs(offre);
  }
  return api.get<Credits>('/credits');
}

/** Dernière demande d'export de toutes les données (RGPD), ou `null`. */
export async function lireExport(): Promise<ExportDonnees | null> {
  if (PARAMETRES_FICTIF) {
    await attendre(300);
    return lireExportFictif();
  }
  const reponse = await api.get<{ export: ExportDonnees | null }>('/compte/export');
  return reponse.export;
}

/** Demande un export : le serveur prépare l'archive et envoie aussi le lien par email. */
export async function demanderExport(): Promise<ExportDonnees> {
  if (PARAMETRES_FICTIF) {
    await attendre(500);
    return demanderExportFictif();
  }
  return api.post<ExportDonnees>('/compte/export', undefined, { delaiMs: 30_000 });
}

/** Suppression définitive du compte et de toutes ses données. En fictif : rien n'est supprimé. */
export async function supprimerCompte(): Promise<void> {
  if (PARAMETRES_FICTIF) {
    await attendre(800);
    return;
  }
  await api.post('/compte/suppression', { confirmation: 'SUPPRIMER' }, { delaiMs: 60_000 });
}

/** Préférences de nutrition. `avecSante` ne sert qu'à la source fictive (le serveur vérifie le consentement). */
export async function lireNutrition(avecSante: boolean): Promise<PreferencesNutrition> {
  if (PARAMETRES_FICTIF) {
    await attendre(300);
    return lireNutritionFictive(avecSante);
  }
  return api.get<PreferencesNutrition>('/preferences/nutrition');
}

export async function modifierNutrition(modification: Partial<PreferencesNutrition>): Promise<PreferencesNutrition> {
  if (PARAMETRES_FICTIF) {
    await attendre(300);
    return modifierNutritionFictive(modification);
  }
  return api.patch<PreferencesNutrition>('/preferences/nutrition', modification);
}

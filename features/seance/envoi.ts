import { ApiError } from '@/lib/api';

import { type EntreeEnvoi, lister, retirer } from './fileEnvoi';
import { envoyerEntree } from './source';

export type ResultatEnvoi = { envoyees: number; restantes: number; horsLigne: boolean };

/** Pour chaque clé, seule la dernière entrée compte : les plus anciennes sont remplacées. */
export function separerRemplacees(entrees: EntreeEnvoi[]): { aEnvoyer: EntreeEnvoi[]; remplacees: string[] } {
  const derniere = new Map<string, EntreeEnvoi>();
  for (const e of entrees) derniere.set(e.cle, e);
  const gardees = new Set([...derniere.values()].map((e) => e.id));
  return {
    aEnvoyer: entrees.filter((e) => gardees.has(e.id)),
    remplacees: entrees.filter((e) => !gardees.has(e.id)).map((e) => e.id),
  };
}

/** Réseau absent ou serveur en panne : on réessaiera ; une erreur 4xx ne passera jamais. */
function reessayable(erreur: unknown): boolean {
  return !(erreur instanceof ApiError) || erreur.status === 0 || erreur.status === 401 || erreur.status >= 500;
}

let enCours: Promise<ResultatEnvoi> | null = null;
let dernierHorsLigne = false;
const auditeursReseau = new Set<(horsLigne: boolean) => void>();

/** Prévient quand le dernier envoi a échoué faute de réseau (ou a réussi), quel que soit l'écran qui l'a lancé. */
export function abonnerReseau(auditeur: (horsLigne: boolean) => void): () => void {
  auditeursReseau.add(auditeur);
  auditeur(dernierHorsLigne);
  return () => auditeursReseau.delete(auditeur);
}

/**
 * Vide la file dans l'ordre. S'arrête à la première coupure réseau (on réessaiera plus tard).
 * Un seul envoi à la fois, même si plusieurs écrans le demandent.
 */
export function viderFile(): Promise<ResultatEnvoi> {
  if (!enCours) {
    enCours = vider()
      .then((resultat) => {
        dernierHorsLigne = resultat.horsLigne;
        auditeursReseau.forEach((auditeur) => auditeur(resultat.horsLigne));
        return resultat;
      })
      .finally(() => {
        enCours = null;
      });
  }
  return enCours;
}

async function vider(): Promise<ResultatEnvoi> {
  const { aEnvoyer, remplacees } = separerRemplacees(await lister());
  if (remplacees.length) await retirer(remplacees);
  let envoyees = 0;
  for (const entree of aEnvoyer) {
    try {
      await envoyerEntree(entree);
    } catch (erreur) {
      if (reessayable(erreur)) {
        return { envoyees, restantes: aEnvoyer.length - envoyees, horsLigne: true };
      }
      // Refus définitif du serveur (données invalides) : on l'écarte pour ne pas bloquer la file.
      console.warn(`[file d'envoi] ${entree.methode} ${entree.chemin} refusé`, erreur);
    }
    await retirer([entree.id]);
    envoyees += 1;
  }
  // Des séries validées pendant l'envoi : on continue tout de suite.
  if ((await lister()).length) {
    const suite = await vider();
    return { ...suite, envoyees: envoyees + suite.envoyees };
  }
  return { envoyees, restantes: 0, horsLigne: false };
}

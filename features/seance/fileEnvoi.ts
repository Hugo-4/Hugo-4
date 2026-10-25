import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * File d'envoi hors ligne : chaque série validée (et le retour de fin de séance) est écrite ici
 * AVANT tout appel réseau, puis envoyée par `envoi.ts`. Rien n'est perdu si l'app est fermée
 * ou si le réseau coupe. Interface volontairement minimale (ajouter, lister, retirer) pour pouvoir
 * passer à expo-sqlite plus tard sans toucher aux écrans.
 */

export type EntreeEnvoi = {
  /** Identifiant unique généré sur le téléphone, envoyé en `Idempotency-Key`. */
  id: string;
  creeLe: string;
  methode: 'PUT' | 'POST';
  chemin: string;
  corps: unknown;
  /**
   * Entrées qui se remplacent : pour un même exercice, la dernière série validée porte la liste
   * complète des séries (PUT), les précédentes deviennent inutiles.
   */
  cle: string;
};

const CLE_STOCKAGE = 'athlenis.fileEnvoi.v1';

let ecritures: Promise<unknown> = Promise.resolve();
const auditeurs = new Set<(nombre: number) => void>();

/** Les écritures passent l'une après l'autre : deux validations rapides ne s'écrasent pas. */
function enSerie<T>(operation: () => Promise<T>): Promise<T> {
  const suite = ecritures.then(operation, operation);
  ecritures = suite.catch(() => undefined);
  return suite;
}

async function lire(): Promise<EntreeEnvoi[]> {
  const brut = await AsyncStorage.getItem(CLE_STOCKAGE);
  if (!brut) return [];
  try {
    const liste = JSON.parse(brut);
    return Array.isArray(liste) ? liste : [];
  } catch {
    return [];
  }
}

async function ecrire(liste: EntreeEnvoi[]) {
  await AsyncStorage.setItem(CLE_STOCKAGE, JSON.stringify(liste));
  auditeurs.forEach((auditeur) => auditeur(liste.length));
}

/** Identifiant unique sans dépendance (format UUID v4). */
export function nouvelIdentifiant(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.floor(Math.random() * 16);
    return (c === 'x' ? r : (r % 4) + 8).toString(16);
  });
}

export function ajouter(entree: Omit<EntreeEnvoi, 'id' | 'creeLe'>): Promise<EntreeEnvoi> {
  return enSerie(async () => {
    const complete: EntreeEnvoi = { ...entree, id: nouvelIdentifiant(), creeLe: new Date().toISOString() };
    await ecrire([...(await lire()), complete]);
    return complete;
  });
}

/** Entrées en attente, de la plus ancienne à la plus récente. */
export function lister(): Promise<EntreeEnvoi[]> {
  return enSerie(lire);
}

export function retirer(ids: string[]): Promise<void> {
  return enSerie(async () => {
    const aRetirer = new Set(ids);
    await ecrire((await lire()).filter((e) => !aRetirer.has(e.id)));
  });
}

/** Prévient à chaque changement du nombre d'entrées (bandeau « 3 séries en attente »). */
export function abonner(auditeur: (nombre: number) => void): () => void {
  auditeurs.add(auditeur);
  return () => auditeurs.delete(auditeur);
}

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * Stockage de la session Supabase dans le trousseau (iOS) / Keystore (Android).
 * SecureStore limite chaque valeur à ~2 Ko alors qu'une session peut dépasser cette taille :
 * la valeur est donc découpée en morceaux (`<clé>.0`, `<clé>.1`…) et leur nombre est noté dans `<clé>.n`.
 * Sur le web (aperçu de développement uniquement), on utilise localStorage.
 */

const TAILLE_MORCEAU = 1800;

async function nombreMorceaux(cle: string): Promise<number> {
  const n = await SecureStore.getItemAsync(`${cle}.n`);
  return n ? Number(n) : 0;
}

async function supprimerMorceaux(cle: string, aPartirDe: number, jusqua: number) {
  for (let i = aPartirDe; i < jusqua; i++) {
    await SecureStore.deleteItemAsync(`${cle}.${i}`);
  }
}

const natif = {
  async getItem(cle: string): Promise<string | null> {
    const n = await nombreMorceaux(cle);
    if (n === 0) return null;
    const morceaux = await Promise.all(
      Array.from({ length: n }, (_, i) => SecureStore.getItemAsync(`${cle}.${i}`)),
    );
    return morceaux.some((m) => m === null) ? null : morceaux.join('');
  },
  async setItem(cle: string, valeur: string): Promise<void> {
    const ancien = await nombreMorceaux(cle);
    const morceaux = valeur.match(new RegExp(`[\\s\\S]{1,${TAILLE_MORCEAU}}`, 'g')) ?? [''];
    for (let i = 0; i < morceaux.length; i++) {
      await SecureStore.setItemAsync(`${cle}.${i}`, morceaux[i]);
    }
    await SecureStore.setItemAsync(`${cle}.n`, String(morceaux.length));
    await supprimerMorceaux(cle, morceaux.length, ancien);
  },
  async removeItem(cle: string): Promise<void> {
    await supprimerMorceaux(cle, 0, await nombreMorceaux(cle));
    await SecureStore.deleteItemAsync(`${cle}.n`);
  },
};

const web = {
  getItem: async (cle: string) => (typeof localStorage === 'undefined' ? null : localStorage.getItem(cle)),
  setItem: async (cle: string, valeur: string) => localStorage.setItem(cle, valeur),
  removeItem: async (cle: string) => localStorage.removeItem(cle),
};

export const secureStorage = Platform.OS === 'web' ? web : natif;

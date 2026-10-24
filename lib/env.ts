/**
 * Variables d'environnement publiques (fichier .env, voir .env.example).
 * Expo n'injecte `process.env.EXPO_PUBLIC_*` que si on y accède directement, sans déstructuration.
 */

function requise(nom: string, valeur: string | undefined): string {
  if (!valeur) {
    throw new Error(`${nom} manquant : copie .env.example en .env et remplis-le, puis relance « npx expo start ».`);
  }
  return valeur;
}

/**
 * Les routes de l'app sont sous /api/athlete (index.js du serveur) : le préfixe est ajouté
 * s'il manque, pour qu'une URL saisie sans lui (http://IP:3000) fonctionne quand même.
 */
export function normaliserApiUrl(brute: string | undefined): string {
  const url = (brute ?? '').trim().replace(/\/+$/, '');
  if (!url || url.endsWith('/api/athlete')) return url;
  return url.endsWith('/api') ? `${url}/athlete` : `${url}/api/athlete`;
}

export const env = {
  supabaseUrl: requise('EXPO_PUBLIC_SUPABASE_URL', process.env.EXPO_PUBLIC_SUPABASE_URL),
  supabaseAnonKey: requise('EXPO_PUBLIC_SUPABASE_ANON_KEY', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY),
  /** URL du serveur coachia-agents-v6 ; vérifiée au moment du premier appel (lib/api.ts). */
  apiUrl: normaliserApiUrl(process.env.EXPO_PUBLIC_API_URL),
};

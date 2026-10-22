/**
 * Lecture des liens qui reviennent dans l'app après une action Supabase Auth :
 * connexion Google / Apple (OAuth) et réinitialisation du mot de passe.
 * Les jetons arrivent dans le fragment (#access_token=…&refresh_token=…&type=recovery).
 */

export type LienAuth =
  | { jetons: { access_token: string; refresh_token: string }; recuperation: boolean }
  | { erreur: string }
  | null;

export function lireLienAuth(url: string): LienAuth {
  const fragment = url.includes('#') ? url.slice(url.indexOf('#') + 1) : '';
  const requete = url.includes('?') ? url.slice(url.indexOf('?') + 1).split('#')[0] : '';
  const params = new URLSearchParams([requete, fragment].filter(Boolean).join('&'));

  const erreur = params.get('error_description') ?? params.get('error');
  if (erreur) return { erreur };

  const access_token = params.get('access_token');
  const refresh_token = params.get('refresh_token');
  if (!access_token || !refresh_token) return null;
  return { jetons: { access_token, refresh_token }, recuperation: params.get('type') === 'recovery' };
}

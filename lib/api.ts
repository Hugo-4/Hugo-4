import { env } from './env';
import { supabase } from './supabase';

/**
 * Client du serveur coachia-agents-v6.
 * Chaque appel envoie `Authorization: Bearer <access_token>` de la session Supabase.
 * Sur un 401 : la session est rafraîchie et l'appel rejoué une fois ; si c'est encore refusé,
 * l'athlète est déconnecté et renvoyé vers l'écran de connexion.
 */

export class ApiError extends Error {
  constructor(
    readonly status: number,
    message: string,
    readonly corps?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type Methode = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type Options = {
  corps?: unknown;
  /** Délai maximal de la requête (ex. 150 s pour la génération du programme). */
  delaiMs?: number;
};

async function jetonActuel(): Promise<string | null> {
  const { data } = await supabase.auth.getSession();
  return data.session?.access_token ?? null;
}

async function jetonRafraichi(): Promise<string | null> {
  const { data, error } = await supabase.auth.refreshSession();
  return error ? null : (data.session?.access_token ?? null);
}

async function envoyer(methode: Methode, chemin: string, jeton: string | null, options: Options) {
  const controleur = new AbortController();
  const minuteur = options.delaiMs ? setTimeout(() => controleur.abort(), options.delaiMs) : undefined;
  try {
    return await fetch(`${env.apiUrl.replace(/\/$/, '')}${chemin}`, {
      method: methode,
      headers: {
        Accept: 'application/json',
        ...(options.corps !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...(jeton ? { Authorization: `Bearer ${jeton}` } : {}),
      },
      body: options.corps !== undefined ? JSON.stringify(options.corps) : undefined,
      signal: controleur.signal,
    });
  } finally {
    clearTimeout(minuteur);
  }
}

async function lireCorps(reponse: Response): Promise<unknown> {
  const texte = await reponse.text();
  if (!texte) return undefined;
  try {
    return JSON.parse(texte);
  } catch {
    return texte;
  }
}

async function requete<T>(methode: Methode, chemin: string, options: Options = {}): Promise<T> {
  if (!env.apiUrl) {
    throw new ApiError(0, 'EXPO_PUBLIC_API_URL manquant dans .env');
  }

  let reponse = await envoyer(methode, chemin, await jetonActuel(), options);

  if (reponse.status === 401) {
    const nouveauJeton = await jetonRafraichi();
    if (nouveauJeton) {
      reponse = await envoyer(methode, chemin, nouveauJeton, options);
    }
    if (reponse.status === 401) {
      await supabase.auth.signOut({ scope: 'local' });
      throw new ApiError(401, 'Session expirée', await lireCorps(reponse));
    }
  }

  const corps = await lireCorps(reponse);
  if (!reponse.ok) {
    throw new ApiError(reponse.status, `${methode} ${chemin} : ${reponse.status}`, corps);
  }
  return corps as T;
}

/** Message lisible renvoyé par le serveur (`{ erreur }`), s'il y en a un. */
export function messageServeur(erreur: unknown): string | null {
  if (erreur instanceof ApiError && erreur.status >= 400 && erreur.status < 500) {
    const corps = erreur.corps as { erreur?: unknown } | undefined;
    if (corps && typeof corps.erreur === 'string') return corps.erreur;
  }
  return null;
}

export const api = {
  get: <T>(chemin: string, options?: Omit<Options, 'corps'>) => requete<T>('GET', chemin, options),
  post: <T>(chemin: string, corps?: unknown, options?: Options) => requete<T>('POST', chemin, { ...options, corps }),
  put: <T>(chemin: string, corps?: unknown, options?: Options) => requete<T>('PUT', chemin, { ...options, corps }),
  patch: <T>(chemin: string, corps?: unknown, options?: Options) =>
    requete<T>('PATCH', chemin, { ...options, corps }),
  delete: <T>(chemin: string, options?: Omit<Options, 'corps'>) => requete<T>('DELETE', chemin, options),
};

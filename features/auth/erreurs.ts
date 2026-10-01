import { isAuthApiError, isAuthRetryableFetchError } from '@supabase/supabase-js';

/** Clé de traduction du message à afficher pour une erreur d'authentification. */
export type CleErreurAuth =
  | 'auth.erreurs.identifiants'
  | 'auth.erreurs.dejaInscrit'
  | 'auth.erreurs.emailNonConfirme'
  | 'auth.erreurs.motDePasseFaible'
  | 'auth.erreurs.emailInvalide'
  | 'auth.erreurs.tropDeTentatives'
  | 'auth.erreurs.reseau'
  | 'auth.erreurs.inconnue';

const PAR_CODE: Record<string, CleErreurAuth> = {
  invalid_credentials: 'auth.erreurs.identifiants',
  user_already_exists: 'auth.erreurs.dejaInscrit',
  email_exists: 'auth.erreurs.dejaInscrit',
  email_not_confirmed: 'auth.erreurs.emailNonConfirme',
  weak_password: 'auth.erreurs.motDePasseFaible',
  email_address_invalid: 'auth.erreurs.emailInvalide',
  validation_failed: 'auth.erreurs.emailInvalide',
  over_request_rate_limit: 'auth.erreurs.tropDeTentatives',
  over_email_send_rate_limit: 'auth.erreurs.tropDeTentatives',
};

export class CompteExistantError extends Error {}

export function cleErreurAuth(erreur: unknown): CleErreurAuth {
  if (erreur instanceof CompteExistantError) return 'auth.erreurs.dejaInscrit';
  if (isAuthRetryableFetchError(erreur)) return 'auth.erreurs.reseau';
  if (isAuthApiError(erreur) && erreur.code && PAR_CODE[erreur.code]) return PAR_CODE[erreur.code];
  if (erreur instanceof TypeError) return 'auth.erreurs.reseau';
  return 'auth.erreurs.inconnue';
}

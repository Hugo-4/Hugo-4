export const LONGUEUR_MIN_MOT_DE_PASSE = 8;

const FORMAT_EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type ErreursFormulaire = {
  email?: 'auth.erreurs.emailInvalide';
  motDePasse?: 'auth.erreurs.motDePasseCourt';
};

/** Contrôle de forme avant envoi ; les vraies règles restent celles de Supabase. */
export function validerIdentifiants(email: string, motDePasse: string): ErreursFormulaire {
  const erreurs: ErreursFormulaire = {};
  if (!FORMAT_EMAIL.test(email.trim())) erreurs.email = 'auth.erreurs.emailInvalide';
  if (motDePasse.length < LONGUEUR_MIN_MOT_DE_PASSE) erreurs.motDePasse = 'auth.erreurs.motDePasseCourt';
  return erreurs;
}

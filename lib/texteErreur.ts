import { useTranslation } from 'react-i18next';

import { ApiError, causeEchec, messageServeur } from './api';
import { env } from './env';

/**
 * Message lisible pour un échec : message du serveur s'il y en a un, sinon la cause
 * (serveur injoignable, délai dépassé, erreur du serveur). `null` si la cause est inconnue.
 */
export function useTexteErreur() {
  const { t } = useTranslation();
  return (erreur: unknown): string | null => {
    const message = messageServeur(erreur);
    if (message) return message;
    switch (causeEchec(erreur)) {
      case 'injoignable':
        // L'adresse n'est affichée qu'en développement, pour vérifier .env.
        return t('commun.erreurs.injoignable', { adresse: __DEV__ ? env.apiUrl : '' });
      case 'delai':
        return t('commun.erreurs.delai');
      case 'serveur':
        return t('commun.erreurs.serveur');
      default:
        return null;
    }
  };
}

/** Détail technique de l'erreur, uniquement en développement (diagnostic depuis Expo Go). */
export function detailTechnique(erreur: unknown): string | null {
  if (!__DEV__ || !erreur) return null;
  if (erreur instanceof ApiError) {
    const corps = erreur.corps as { erreur?: unknown } | undefined;
    return typeof corps?.erreur === 'string' ? `${erreur.message} — ${corps.erreur}` : erreur.message;
  }
  if (typeof erreur === 'object' && 'message' in erreur) return String(erreur.message);
  return String(erreur);
}

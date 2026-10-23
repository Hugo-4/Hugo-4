import { useTranslation } from 'react-i18next';

import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { causeEchec, messageServeur } from '@/lib/api';
import { env } from '@/lib/env';

/**
 * Erreur lisible : message du serveur s'il y en a un, sinon la cause
 * (serveur injoignable, délai dépassé, erreur du serveur).
 */
export function ErreurEnregistrement({ erreur }: { erreur: unknown }) {
  const { t } = useTranslation();
  const message = messageServeur(erreur);
  if (message) return <MessageErreur texte={message} />;
  switch (causeEchec(erreur)) {
    case 'injoignable':
      // L'adresse n'est affichée qu'en développement, pour vérifier .env.
      return <MessageErreur texte={t('commun.erreurs.injoignable', { adresse: __DEV__ ? env.apiUrl : '' })} />;
    case 'delai':
      return <MessageErreur texte={t('commun.erreurs.delai')} />;
    case 'serveur':
      return <MessageErreur texte={t('commun.erreurs.serveur')} />;
    default:
      return <MessageErreur texte={t('inscription.erreurs.enregistrement')} />;
  }
}

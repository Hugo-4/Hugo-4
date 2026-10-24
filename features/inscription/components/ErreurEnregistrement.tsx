import { useTranslation } from 'react-i18next';

import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { useTexteErreur } from '@/lib/texteErreur';

/**
 * Erreur lisible : message du serveur s'il y en a un, sinon la cause
 * (serveur injoignable, délai dépassé, erreur du serveur).
 */
export function ErreurEnregistrement({ erreur }: { erreur: unknown }) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  return <MessageErreur texte={texteErreur(erreur) ?? t('inscription.erreurs.enregistrement')} />;
}

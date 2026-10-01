import { useTranslation } from 'react-i18next';

import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { messageServeur } from '@/lib/api';

/** Erreur lisible pendant l'enregistrement (message du serveur s'il y en a un). */
export function ErreurEnregistrement({ erreur }: { erreur: unknown }) {
  const { t } = useTranslation();
  return <MessageErreur texte={messageServeur(erreur) ?? t('inscription.erreurs.enregistrement')} />;
}

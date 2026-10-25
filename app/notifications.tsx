import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Liste des notifications (finitions). */
export default function NotificationsScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('notifications.titre')} />;
}

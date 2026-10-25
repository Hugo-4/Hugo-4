import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Historique des adaptations (étape 7). */
export default function AdaptationsScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('programme.titre')} />;
}

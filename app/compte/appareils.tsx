import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Profil : appareils (étape 9). */
export default function AppareilsScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('parametres.titre')} />;
}

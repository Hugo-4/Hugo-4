import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Profil : memoire (étape 9). */
export default function MemoireScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('parametres.titre')} />;
}

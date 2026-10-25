import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Profil : lieux (étape 9). */
export default function LieuxScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('parametres.titre')} />;
}

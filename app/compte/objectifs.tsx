import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Profil : objectifs (étape 9). */
export default function ObjectifsScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('parametres.titre')} />;
}

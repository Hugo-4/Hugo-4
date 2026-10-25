import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Profil : disponibilites (étape 9). */
export default function DisponibilitesScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('parametres.titre')} />;
}

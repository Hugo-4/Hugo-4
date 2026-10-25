import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Détail d'une séance prévue (étape 7). */
export default function SeanceProgrammeScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('programme.titre')} />;
}

import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Ajouter une compétition (étape 7). */
export default function NouvelEvenementScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('programme.titre')} />;
}

import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Modifier ou supprimer une compétition (étape 7). */
export default function EvenementScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('programme.titre')} />;
}

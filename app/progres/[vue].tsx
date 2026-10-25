import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Détail Progrès : tests, charge, records, niveaux, régularité (étape 8). */
export default function ProgresDetailScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('progres.titre')} />;
}

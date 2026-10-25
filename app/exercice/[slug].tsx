import { useTranslation } from 'react-i18next';

import { EcranAVenir } from '@/components/EcranAVenir';

/** Fiche technique d'un exercice, en feuille (étape 7). */
export default function ExerciceScreen() {
  const { t } = useTranslation();
  return <EcranAVenir titre={t('programme.titre')} />;
}

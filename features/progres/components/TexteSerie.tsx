import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';

import type { Regularite } from '../types';

/**
 * Série en cours. Après une pause ou une semaine incomplète, aucun message de honte :
 * on dit seulement que la prochaine semaine réussie lance une nouvelle série.
 */
export function TexteSerie({ regularite }: { regularite: Regularite }) {
  const { t } = useTranslation();
  if (regularite.serie_en_cours > 0) {
    return <AppText variant="corpsGras">{t('progres.regularite.serie', { count: regularite.serie_en_cours })}</AppText>;
  }
  return <AppText variant="secondaire">{t('progres.regularite.nouvelleSerie')}</AppText>;
}

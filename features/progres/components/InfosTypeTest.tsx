import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';

import type { TypeTest } from '../types';

/** Sens du test (plus haut ou plus bas = mieux), durée de validité et protocole (texte du serveur). */
export function InfosTypeTest({ type }: { type: TypeTest }) {
  const { t } = useTranslation();
  const protocole = typeof type.protocole === 'string' && type.protocole.trim() ? type.protocole : null;
  if (type.plus_haut_mieux === null && !type.validite_jours && !protocole) return null;
  return (
    <Card>
      <AppText variant="surTitre">{t('progres.tests.aSavoir')}</AppText>
      {type.plus_haut_mieux !== null ? (
        <AppText variant="secondaire">{t(type.plus_haut_mieux ? 'progres.tests.sensHaut' : 'progres.tests.sensBas')}</AppText>
      ) : null}
      {type.validite_jours ? (
        <AppText variant="secondaire">{t('progres.tests.validite', { count: type.validite_jours })}</AppText>
      ) : null}
      {protocole ? (
        <>
          <AppText variant="corpsGras">{t('progres.tests.protocole')}</AppText>
          <AppText variant="secondaire">{protocole}</AppText>
        </>
      ) : null}
    </Card>
  );
}

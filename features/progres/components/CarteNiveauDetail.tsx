import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';

import { formatDateJour, formatValeur } from '../format';
import { libelleMethode } from '../presentation';
import type { QualiteNiveau } from '../types';
import { LigneNiveau } from './LigneNiveau';

type Props = { qualite: QualiteNiveau; onPress?: () => void };

/** Une qualité : percentile + groupe de comparaison + résultat de test sur lequel il s'appuie. */
export function CarteNiveauDetail({ qualite, onPress }: Props) {
  const { t } = useTranslation();
  const base = [formatValeur(qualite.valeur, qualite.unite), libelleMethode(qualite.test.methode)].filter(Boolean).join(' · ');
  return (
    <Card>
      <LigneNiveau qualite={qualite} afficherGroupe onPress={onPress} />
      <AppText variant="secondaire">{t('progres.niveaux.base', { date: formatDateJour(qualite.test.date), valeur: base })}</AppText>
    </Card>
  );
}

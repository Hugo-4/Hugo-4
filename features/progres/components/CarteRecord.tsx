import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';

import type { EtatSection } from '../etats';
import { PROGRES_FICTIF } from '../source';
import type { RecordJalon } from '../types';
import { CarteSection } from './CarteSection';
import { ContenuRecord } from './ContenuRecord';

type Props = {
  records: RecordJalon[] | undefined;
  etat: EtatSection;
  onReessayer: () => void;
  onPress: () => void;
};

/** Dernier record ou jalon (le plus récent renvoyé par le serveur). */
export function CarteRecord({ records, etat, onReessayer, onPress }: Props) {
  const { t } = useTranslation();
  const dernier = records?.[0];
  return (
    <CarteSection
      titre={t('progres.records.dernier')}
      etat={etat}
      onReessayer={onReessayer}
      onPress={dernier ? onPress : undefined}
      exemple={PROGRES_FICTIF}>
      {dernier ? (
        <ContenuRecord record={dernier} grand />
      ) : (
        <AppText variant="secondaire">{t('progres.records.videTexte')}</AppText>
      )}
    </CarteSection>
  );
}

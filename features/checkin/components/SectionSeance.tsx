import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';

import { DUREES_DISPONIBLES } from '../constantes';
import type { LieuAthlete } from '../useLieux';

type Props = {
  dureeMin: number | null;
  lieuId: string | null;
  lieux: LieuAthlete[];
  onDuree: (duree: number | null) => void;
  onLieu: (lieuId: string | null) => void;
};

/** Durée disponible et lieu du jour (facultatifs). */
export function SectionSeance({ dureeMin, lieuId, lieux, onDuree, onLieu }: Props) {
  const { t } = useTranslation();
  return (
    <View>
      <GroupeChoix titre={t('checkin.duree')} aide={t('checkin.facultatif')} radio>
        {DUREES_DISPONIBLES.map((duree) => (
          <Chip
            key={duree}
            role="radio"
            label={t('inscription.dispos.minutes', { minutes: duree })}
            selectionne={dureeMin === duree}
            onPress={() => onDuree(dureeMin === duree ? null : duree)}
          />
        ))}
      </GroupeChoix>
      {lieux.length > 0 ? (
        <GroupeChoix titre={t('checkin.lieu')} aide={t('checkin.facultatif')} radio>
          {lieux.map((lieu) => (
            <Chip
              key={lieu.id}
              role="radio"
              label={lieu.nom}
              selectionne={lieuId === lieu.id}
              onPress={() => onLieu(lieuId === lieu.id ? null : lieu.id)}
            />
          ))}
        </GroupeChoix>
      ) : null}
    </View>
  );
}

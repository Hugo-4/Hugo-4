import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { ZONES, type Zone } from '@/features/inscription/constantes';

type Props = {
  consentementSante: boolean;
  douleurs: Zone[];
  onChange: (douleurs: Zone[]) => void;
};

/** Zones douloureuses ; sans consentement « données de santé », la question n'est pas posée. */
export function SectionDouleurs({ consentementSante, douleurs, onChange }: Props) {
  const { t } = useTranslation();
  if (!consentementSante) {
    return <AppText variant="libelle">{t('checkin.douleursSansConsentement')}</AppText>;
  }
  return (
    <GroupeChoix titre={t('checkin.douleurs')} aide={t('checkin.douleursAide')}>
      {ZONES.map((zone) => (
        <Chip
          key={zone}
          label={t(`inscription.zones.${zone}`)}
          selectionne={douleurs.includes(zone)}
          onPress={() => onChange(douleurs.includes(zone) ? douleurs.filter((z) => z !== zone) : [...douleurs, zone])}
        />
      ))}
    </GroupeChoix>
  );
}

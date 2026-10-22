import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';

import { CAUSES_PONCTUELLES, type CausePonctuelle } from '../constantes';

type Props = {
  valeur: CausePonctuelle | null;
  onChange: (cause: CausePonctuelle | null) => void;
};

/** « C'est passager ? » : une journée expliquée ainsi ne change que la séance du jour. */
export function SectionPassager({ valeur, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <GroupeChoix titre={t('checkin.passager')} aide={t('checkin.passagerAide')} radio>
      {CAUSES_PONCTUELLES.map((cause) => (
        <Chip
          key={cause}
          role="radio"
          label={t(`checkin.causes.${cause}`)}
          selectionne={valeur === cause}
          onPress={() => onChange(valeur === cause ? null : cause)}
        />
      ))}
    </GroupeChoix>
  );
}

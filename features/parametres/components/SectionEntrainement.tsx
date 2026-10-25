import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { SectionProfil } from '@/features/profil/components/SectionProfil';

import { MOMENTS, VARIETES } from '../constantes';
import type { ModificationPreferences, Preferences } from '../types';

type Props = {
  preferences: Preferences;
  onModifier: (m: ModificationPreferences) => void;
};

/** Entraînement : variété des exercices (1 à 5) et moment préféré. */
export function SectionEntrainement({ preferences, onModifier }: Props) {
  const { t } = useTranslation();
  return (
    <SectionProfil titre={t('parametres.preferences.entrainement')}>
      <GroupeChoix titre={t('parametres.preferences.variete')} aide={t('parametres.preferences.varieteAide')} radio>
        {VARIETES.map((note) => (
          <Chip
            key={note}
            role="radio"
            label={String(note)}
            accessibilityLabel={t('parametres.preferences.a11yVariete', { note })}
            selectionne={preferences.preference_variete === note}
            onPress={() => onModifier({ preference_variete: note })}
          />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('parametres.preferences.moment')} radio>
        {MOMENTS.map((moment) => (
          <Chip
            key={moment}
            role="radio"
            label={t(`parametres.preferences.moments.${moment}`)}
            selectionne={preferences.moment_prefere === moment}
            onPress={() => onModifier({ moment_prefere: moment })}
          />
        ))}
      </GroupeChoix>
    </SectionProfil>
  );
}

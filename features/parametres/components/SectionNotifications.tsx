import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { Interrupteur } from '@/components/Interrupteur';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { SectionProfil } from '@/features/profil/components/SectionProfil';

import { DEBUTS_CALME, FINS_CALME, NOTIFICATIONS_DEFAUT, RAPPELS_MIN } from '../constantes';
import { formatHeure } from '../format';
import type { ModificationPreferences, Preferences, ReglagesNotifications } from '../types';

type Props = {
  preferences: Preferences;
  onModifier: (m: ModificationPreferences) => void;
};

/** Une valeur enregistrée hors de la liste proposée reste visible (et sélectionnée). */
const avec = <T extends string | number>(liste: readonly T[], valeur: T) =>
  [...new Set([...liste, valeur])].sort((a, b) => String(a).localeCompare(String(b), undefined, { numeric: true }));

/** Notifications : activées, rappel de check-in, minutes avant la séance, heures calmes. */
export function SectionNotifications({ preferences, onModifier }: Props) {
  const { t } = useTranslation();
  const n = { ...NOTIFICATIONS_DEFAUT, ...preferences.notifications };
  const changer = (notifications: Partial<ReglagesNotifications>) => onModifier({ notifications });

  return (
    <SectionProfil titre={t('parametres.preferences.notifications')}>
      <Interrupteur
        libelle={t('parametres.preferences.actives')}
        aide={t('parametres.preferences.activesAide')}
        valeur={n.actives}
        onChange={(actives) => changer({ actives })}
      />
      {n.actives ? (
        <>
          <Interrupteur
            libelle={t('parametres.preferences.checkin')}
            aide={t('parametres.preferences.checkinAide')}
            valeur={n.checkin}
            onChange={(checkin) => changer({ checkin })}
          />
          <GroupeChoix titre={t('parametres.preferences.rappel')} radio>
            {avec(RAPPELS_MIN, n.rappel_min_avant).map((minutes) => (
              <Chip
                key={minutes}
                role="radio"
                label={t('parametres.preferences.minutesAvant', { minutes })}
                selectionne={n.rappel_min_avant === minutes}
                onPress={() => changer({ rappel_min_avant: minutes })}
              />
            ))}
          </GroupeChoix>
          <GroupeChoix
            titre={`${t('parametres.preferences.heuresCalmes')} · ${t('parametres.preferences.debutCalme')}`}
            aide={t('parametres.preferences.heuresCalmesAide')}
            radio>
            {avec(DEBUTS_CALME, n.heure_calme_debut).map((heure) => (
              <Chip
                key={heure}
                role="radio"
                label={formatHeure(heure)}
                selectionne={n.heure_calme_debut === heure}
                onPress={() => changer({ heure_calme_debut: heure })}
              />
            ))}
          </GroupeChoix>
          <GroupeChoix titre={`${t('parametres.preferences.heuresCalmes')} · ${t('parametres.preferences.finCalme')}`} radio>
            {avec(FINS_CALME, n.heure_calme_fin).map((heure) => (
              <Chip
                key={heure}
                role="radio"
                label={formatHeure(heure)}
                selectionne={n.heure_calme_fin === heure}
                onPress={() => changer({ heure_calme_fin: heure })}
              />
            ))}
          </GroupeChoix>
        </>
      ) : null}
    </SectionProfil>
  );
}

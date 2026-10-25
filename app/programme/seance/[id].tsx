import { useLocalSearchParams } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Toast } from '@/components/Toast';
import { SeanceDetailContenu } from '@/features/programme/components/SeanceDetailContenu';
import { SeanceDetailSquelette } from '@/features/programme/components/SeanceDetailSquelette';
import { useEcranSeance } from '@/features/programme/useEcranSeance';
import { formatJourDate } from '@/lib/format';

/** Détail d'une séance prévue (FRONTEND.md §4.5, §3.3). */
export default function SeanceProgrammeScreen() {
  const { t } = useTranslation();
  const { id } = useLocalSearchParams<{ id: string }>();
  const e = useEcranSeance(id);

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <EnTete titre={t('programme.seance.titreEcran')} sousTitre={e.detail ? formatJourDate(e.detail.seance.date) : undefined} />
      <EtatsEcran
        chargement={e.chargement}
        erreur={e.erreur}
        aDesDonnees={e.aDesDonnees}
        onReessayer={e.reessayer}
        squelette={<SeanceDetailSquelette />}>
        {e.detail ? <SeanceDetailContenu e={e} detail={e.detail} /> : null}
      </EtatsEcran>
      <Toast visible={e.toast !== null} texte={e.toast ?? ''} />
    </Screen>
  );
}

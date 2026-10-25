import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EnTete } from '@/components/EnTete';

import { libelleContexte } from '../contexte';
import type { ContexteCoach } from '../ouvrirCoach';
import type { CreditsCoach } from '../types';
import { BoutonCredits } from './BoutonCredits';
import { PuceContexte } from './PuceContexte';

type Props = {
  contexte: ContexteCoach | null;
  credits: CreditsCoach | undefined;
  onRetour: () => void;
  onRetirerContexte: () => void;
};

/** En-tête du chat : retour, « Coach », solde de crédits, puis la puce de contexte si le chat vient d'une séance. */
export function EnTeteCoach({ contexte, credits, onRetour, onRetirerContexte }: Props) {
  const { t } = useTranslation();
  return (
    <View>
      <EnTete titre={t('coach.titre')} onRetour={onRetour} action={<BoutonCredits credits={credits} />} />
      {contexte ? <PuceContexte libelle={libelleContexte(contexte)} onRetirer={onRetirerContexte} /> : null}
    </View>
  );
}

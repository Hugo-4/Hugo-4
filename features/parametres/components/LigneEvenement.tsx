import { router } from 'expo-router';
import { Flag } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { LigneListe } from '@/components/LigneListe';
import i18n from '@/lib/i18n';
import { dateLocale, formatCompteARebours, formatDateEvenement } from '@/lib/format';
import { colors, sizes } from '@/theme/tokens';

import type { Evenement } from '../types';
import { aujourdhuiIso } from '../useEvenements';

const JOUR_MS = 86_400_000;

/** Une compétition : nom, date, type et priorité ; compte à rebours si elle est à venir. Ouvre l'événement. */
export function LigneEvenement({ evenement, aVenir }: { evenement: Evenement; aVenir: boolean }) {
  const { t } = useTranslation();
  const jour = aujourdhuiIso();
  const jours = Math.round((dateLocale(evenement.date_evenement).getTime() - dateLocale(jour).getTime()) / JOUR_MS);
  const cleType = `parametres.objectifs.types.${evenement.type_evenement}`;
  const type = evenement.type_evenement && i18n.exists(cleType) ? String(i18n.t(cleType as never)) : null;
  const details = [
    formatDateEvenement(evenement.date_evenement),
    type,
    t('parametres.objectifs.priorite', { priorite: evenement.priorite }),
  ].filter(Boolean);

  return (
    <LigneListe
      icon={<Flag color={evenement.priorite === 'A' ? colors.accent : colors.texte2} size={sizes.icone} />}
      titre={evenement.nom}
      sousTitre={details.join(' · ')}
      valeur={aVenir ? formatCompteARebours(jours, evenement.date_evenement, jour) : undefined}
      onPress={() => router.push({ pathname: '/programme/evenement/[id]', params: { id: evenement.id } })}
    />
  );
}

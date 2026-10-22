import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { useObjectifsSecondaires } from '@/features/inscription/useReferentiels';
import i18n from '@/lib/i18n';

type Props = {
  valeur: string[];
  onChange: (slugs: string[]) => void;
};

/** Objectifs secondaires (plusieurs choix). */
export function ChoixSecondaires({ valeur, onChange }: Props) {
  const { t } = useTranslation();
  const requete = useObjectifsSecondaires();
  return (
    <GroupeChoix titre={t('inscription.etapes.objectifsSecondaires.titre')}>
      {(requete.data ?? []).map((slug) => {
        const cle = `inscription.secondaires.${slug}`;
        return (
          <Chip
            key={slug}
            label={i18n.exists(cle) ? String(i18n.t(cle as never)) : slug}
            selectionne={valeur.includes(slug)}
            onPress={() => onChange(valeur.includes(slug) ? valeur.filter((s) => s !== slug) : [...valeur, slug])}
          />
        );
      })}
    </GroupeChoix>
  );
}

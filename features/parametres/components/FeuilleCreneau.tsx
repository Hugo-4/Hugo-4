import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Feuille } from '@/components/Feuille';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';

import { DUREES_CRENEAU } from '../constantes';
import type { Lieu } from '../types';
import type { CreneauEdite } from '../useEditionDisponibilites';

type Props = {
  creneau: CreneauEdite;
  titre: string;
  lieux: Lieu[];
  onValider: (changement: Pick<CreneauEdite, 'duree_max_min' | 'lieu_id'>) => void;
  onRetirer: () => void;
  onFermer: () => void;
};

/** Réglage d'un créneau : durée maximale et lieu. */
export function FeuilleCreneau({ creneau, titre, lieux, onValider, onRetirer, onFermer }: Props) {
  const { t } = useTranslation();
  const [duree, setDuree] = useState(creneau.duree_max_min);
  const [lieuId, setLieuId] = useState(creneau.lieu_id);
  const durees = [...new Set<number>([...DUREES_CRENEAU, creneau.duree_max_min])].sort((a, b) => a - b);

  return (
    <Feuille visible titre={titre} onFermer={onFermer}>
      <GroupeChoix titre={t('parametres.disponibilites.duree')} radio>
        {durees.map((d) => (
          <Chip
            key={d}
            role="radio"
            label={t('parametres.disponibilites.dureeMin', { minutes: d })}
            selectionne={duree === d}
            onPress={() => setDuree(d)}
          />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('parametres.disponibilites.lieu')} radio>
        <Chip
          role="radio"
          label={t('parametres.disponibilites.sansLieu')}
          selectionne={lieuId === null}
          onPress={() => setLieuId(null)}
        />
        {lieux.map((l) => (
          <Chip key={l.id} role="radio" label={l.nom} selectionne={lieuId === l.id} onPress={() => setLieuId(l.id)} />
        ))}
      </GroupeChoix>
      <Button label={t('parametres.disponibilites.valider')} onPress={() => onValider({ duree_max_min: duree, lieu_id: lieuId })} />
      <Button label={t('parametres.disponibilites.retirer')} variant="secondaire" onPress={onRetirer} />
    </Feuille>
  );
}

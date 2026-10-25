import { useState } from 'react';

import type { Creneau } from '@/features/inscription/constantes';

import { DUREE_CRENEAU_DEFAUT } from './constantes';
import type { CreneauSaisi, Disponibilite } from './types';
import { versCreneauSaisi } from './useDisponibilites';

export type CreneauEdite = Pick<Disponibilite, 'jour' | 'creneau' | 'heure_debut' | 'duree_max_min' | 'lieu_id'>;

const cle = (jour: number, creneau: Creneau) => `${jour}-${creneau}`;

/**
 * Créneaux en cours de modification (rien n'est envoyé avant « Enregistrer ») : un seul par jour et par
 * moment, comme l'exige le serveur. Un créneau ajouté reprend la durée et le lieu du dernier modifié.
 */
export function useEditionDisponibilites(initiales: Disponibilite[]) {
  const [creneaux, setCreneaux] = useState<Record<string, CreneauEdite>>(() =>
    Object.fromEntries(initiales.map((d) => [cle(d.jour, d.creneau), d])),
  );
  const [modifie, setModifie] = useState(false);
  const [dernier, setDernier] = useState<Pick<CreneauEdite, 'duree_max_min' | 'lieu_id'>>({
    duree_max_min: initiales[0]?.duree_max_min ?? DUREE_CRENEAU_DEFAUT,
    lieu_id: initiales[0]?.lieu_id ?? null,
  });

  const lire = (jour: number, creneau: Creneau): CreneauEdite | undefined => creneaux[cle(jour, creneau)];

  const basculer = (jour: number, creneau: Creneau) => {
    setModifie(true);
    setCreneaux((actuels) => {
      const suivants = { ...actuels };
      if (suivants[cle(jour, creneau)]) delete suivants[cle(jour, creneau)];
      else suivants[cle(jour, creneau)] = { jour, creneau, heure_debut: null, ...dernier };
      return suivants;
    });
  };

  const modifier = (jour: number, creneau: Creneau, changement: Pick<CreneauEdite, 'duree_max_min' | 'lieu_id'>) => {
    setModifie(true);
    setDernier(changement);
    setCreneaux((actuels) => {
      const actuel = actuels[cle(jour, creneau)];
      return actuel ? { ...actuels, [cle(jour, creneau)]: { ...actuel, ...changement } } : actuels;
    });
  };

  const corps: CreneauSaisi[] = Object.values(creneaux)
    .sort((a, b) => a.jour - b.jour)
    .map(versCreneauSaisi);

  return { lire, basculer, modifier, corps, nombre: corps.length, modifie, enregistre: () => setModifie(false) };
}

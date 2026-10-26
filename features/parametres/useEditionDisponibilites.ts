import { useState } from 'react';

import type { Creneau } from '@/features/inscription/constantes';

import { DUREE_CRENEAU_DEFAUT } from './constantes';
import type { CreneauSaisi, Disponibilite, Lieu } from './types';
import { versCreneauSaisi } from './useDisponibilites';

export type CreneauEdite = Pick<Disponibilite, 'jour' | 'creneau' | 'heure_debut' | 'duree_max_min' | 'lieu_id'>;
type Reglage = Pick<CreneauEdite, 'duree_max_min' | 'lieu_id'>;

type Etat = {
  creneaux: Record<string, CreneauEdite>;
  /** Durée et lieu repris par le prochain créneau ajouté. */
  dernier: Reglage;
  /** L'athlète a changé quelque chose depuis le chargement ou le dernier enregistrement. */
  touche: boolean;
  /** Un lieu supprimé a été retiré d'au moins un créneau : à enregistrer. */
  lieuxRetires: boolean;
  /** Données d'où vient l'état (références de TanStack Query, stables tant que rien ne change). */
  initiales: Disponibilite[];
  lieux: Lieu[] | undefined;
};

const cle = (jour: number, creneau: Creneau) => `${jour}-${creneau}`;

const versCorps = (creneaux: Record<string, CreneauEdite>): CreneauSaisi[] =>
  Object.values(creneaux)
    .sort((a, b) => a.jour - b.jour)
    .map(versCreneauSaisi);

function depuisServeur(initiales: Disponibilite[], lieux: Lieu[] | undefined): Etat {
  return {
    creneaux: Object.fromEntries(initiales.map((d) => [cle(d.jour, d.creneau), d])),
    dernier: {
      duree_max_min: initiales[0]?.duree_max_min ?? DUREE_CRENEAU_DEFAUT,
      lieu_id: initiales[0]?.lieu_id ?? null,
    },
    touche: false,
    lieuxRetires: false,
    initiales,
    lieux,
  };
}

/** Ramène à « Peu importe » les créneaux dont le lieu n'est plus actif (seulement quand les lieux sont chargés). */
function sansLieuxSupprimes(etat: Etat): Etat {
  if (!etat.lieux) return etat;
  const actifs = new Set(etat.lieux.map((l) => l.id));
  const orphelin = (id: string | null) => id !== null && !actifs.has(id);
  const aCorriger = Object.values(etat.creneaux).filter((c) => orphelin(c.lieu_id));
  const dernier = orphelin(etat.dernier.lieu_id) ? { ...etat.dernier, lieu_id: null } : etat.dernier;
  if (!aCorriger.length) return { ...etat, dernier };
  const creneaux = { ...etat.creneaux };
  aCorriger.forEach((c) => (creneaux[cle(c.jour, c.creneau)] = { ...c, lieu_id: null }));
  return { ...etat, creneaux, dernier, lieuxRetires: true };
}

/**
 * Créneaux en cours de modification (rien n'est envoyé avant « Enregistrer ») : un seul par jour et par
 * moment, comme l'exige le serveur. Un créneau ajouté reprend la durée et le lieu du dernier modifié.
 * Quand les données du serveur changent (tirer pour rafraîchir, après un enregistrement), l'éditeur
 * repart d'elles, sauf si l'athlète a des modifications en cours.
 * `lieux` : lieux actifs, `undefined` tant qu'ils ne sont pas chargés (hors ligne, erreur).
 */
export function useEditionDisponibilites(initiales: Disponibilite[], lieux: Lieu[] | undefined) {
  const [etat, setEtat] = useState(() => sansLieuxSupprimes(depuisServeur(initiales, lieux)));

  // Ajustement pendant le rendu (pas d'effet) : nouvelles données du serveur ou lieux chargés.
  if (etat.initiales !== initiales || etat.lieux !== lieux) {
    const repartir = etat.initiales !== initiales && !etat.touche;
    setEtat(sansLieuxSupprimes(repartir ? depuisServeur(initiales, lieux) : { ...etat, initiales, lieux }));
  }

  const lire = (jour: number, creneau: Creneau): CreneauEdite | undefined => etat.creneaux[cle(jour, creneau)];

  const basculer = (jour: number, creneau: Creneau) =>
    setEtat((actuel) => {
      const creneaux = { ...actuel.creneaux };
      if (creneaux[cle(jour, creneau)]) delete creneaux[cle(jour, creneau)];
      else creneaux[cle(jour, creneau)] = { jour, creneau, heure_debut: null, ...actuel.dernier };
      return { ...actuel, creneaux, touche: true };
    });

  const modifier = (jour: number, creneau: Creneau, changement: Reglage) =>
    setEtat((actuel) => {
      const existant = actuel.creneaux[cle(jour, creneau)];
      const creneaux = existant ? { ...actuel.creneaux, [cle(jour, creneau)]: { ...existant, ...changement } } : actuel.creneaux;
      return { ...actuel, creneaux, dernier: changement, touche: true };
    });

  /** Après l'enregistrement de `envoye` : plus rien à enregistrer, sauf si l'athlète a encore changé quelque chose entre-temps. */
  const enregistre = (envoye: CreneauSaisi[]) =>
    setEtat((actuel) =>
      JSON.stringify(versCorps(actuel.creneaux)) === JSON.stringify(envoye)
        ? { ...actuel, touche: false, lieuxRetires: false }
        : actuel,
    );

  const corps = versCorps(etat.creneaux);

  return {
    lire,
    basculer,
    modifier,
    corps,
    nombre: corps.length,
    modifie: etat.touche || etat.lieuxRetires,
    lieuxRetires: etat.lieuxRetires,
    enregistre,
  };
}

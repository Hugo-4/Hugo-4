import { dateDuJour } from '@/features/checkin/dateDuJour';

import { ajouterJours, lundiDe } from './dates';
import { dansJours, PREFIXE_FICTIF, texteServeur } from './mockProgres';
import type { ChargeSemaines, LiguesDefis, Regularite, StatutSemaine } from './types';

/** Charge, régularité, ligues et défis fictifs (format de docs/MANQUES-SERVEUR.md §5). */

const CHARGES = [980, 1120, 1240, 1310, 860, 1290, 1380, 1450, 1010, 1420, 1510, 1180];
const SEANCES = [3, 4, 4, 4, 3, 4, 4, 4, 3, 4, 4, 2];
const STATUTS: StatutSemaine[] = [
  'reussie', 'reussie', 'non_reussie', 'reussie', 'pause', 'reussie',
  'reussie', 'non_reussie', 'reussie', 'reussie', 'reussie', 'en_cours',
];

/** Lundis des 12 dernières semaines, la dernière étant la semaine en cours. */
function lundis(): string[] {
  const lundi = lundiDe(dateDuJour());
  return CHARGES.map((_, i) => ajouterJours(lundi, (i - (CHARGES.length - 1)) * 7));
}

export function chargeSemainesFictive(): ChargeSemaines {
  const debuts = lundis();
  return {
    unite: 'UA',
    semaines: debuts.map((debut, i) => ({
      debut,
      charge: CHARGES[i],
      seances: SEANCES[i],
      en_cours: i === debuts.length - 1,
    })),
    zone_optimale: { min: 1050, max: 1710 },
    donnees_suffisantes: true,
  };
}

export function regulariteFictive(): Regularite {
  const debuts = lundis();
  return {
    regle: texteServeur(
      'Une semaine est réussie quand tu fais au moins 80 % des séances prévues. Une semaine sans séance prévue ne compte pas.',
      'A week counts as successful when you complete at least 80% of planned sessions. Weeks with no planned session do not count.',
    ),
    semaines: debuts.map((debut, i) => {
      const statut = STATUTS[i];
      const prevues = statut === 'pause' ? 0 : 4;
      const faites = { reussie: 4, non_reussie: 2, pause: 0, en_cours: 2 }[statut];
      return { debut, prevues, faites, statut };
    }),
    semaines_reussies: 8,
    semaines_comptees: 10,
    serie_en_cours: 3,
    meilleure_serie: 3,
  };
}

/** Ligues rejointes (état local de la source fictive). */
const liguesRejointes = new Set([`${PREFIXE_FICTIF}ligue-vma`]);

export function inscrireLigueFictive(id: string, rejoindre: boolean) {
  if (rejoindre) liguesRejointes.add(id);
  else liguesRejointes.delete(id);
}

export function liguesFictives(): LiguesDefis {
  const ligue = (id: string, nom: string, critere: string, critereLibelle: string, rang: number, participants: number, fin: number) => {
    const inscrit = liguesRejointes.has(id);
    return { id, nom, critere, critere_libelle: critereLibelle, inscrit, rang: inscrit ? rang : null, participants, fin: dansJours(fin) };
  };
  return {
    autorise: true,
    ligues: [
      ligue(`${PREFIXE_FICTIF}ligue-vma`, texteServeur('Ligue VMA · boxe amateurs', 'MAS league · amateur boxing'), 'vma', texteServeur('VMA (test)', 'MAS (test)'), 14, 86, 36),
      ligue(`${PREFIXE_FICTIF}ligue-detente`, texteServeur('Ligue détente · 25-34 ans', 'Jump league · age 25-34'), 'detente', texteServeur('Saut vertical (test)', 'Vertical jump (test)'), 51, 212, 20),
    ],
    defis: [
      {
        id: `${PREFIXE_FICTIF}defi-semaines`,
        nom: texteServeur('Quatre semaines réussies', 'Four successful weeks'),
        description: texteServeur('Réussis 4 semaines d\'affilée.', 'Complete 4 successful weeks in a row.'),
        valeur_actuelle: 3,
        valeur_cible: 4,
        unite: texteServeur('semaines', 'weeks'),
        date_expiration: dansJours(27),
        statut: 'en_cours',
      },
      {
        id: `${PREFIXE_FICTIF}defi-vma`,
        nom: texteServeur('Refaire ton test de VMA', 'Retake your MAS test'),
        description: texteServeur('Refais le test pour mesurer ta progression depuis le dernier.', 'Retake the test to measure your progress since the last one.'),
        valeur_actuelle: 0,
        valeur_cible: 1,
        unite: texteServeur('test', 'test'),
        date_expiration: dansJours(45),
        statut: 'en_cours',
      },
    ],
  };
}

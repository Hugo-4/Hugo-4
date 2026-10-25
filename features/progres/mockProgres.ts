import i18n from '@/lib/i18n';

import { ajouterJours, ilYa } from './dates';
import type { GroupeComparaison, Niveaux, RecordJalon } from './types';

/**
 * Données fictives au format proposé dans docs/MANQUES-SERVEUR.md §5, en attendant les routes serveur.
 * Les identifiants commencent par « fictif- ». Les textes simulent ceux du serveur (langue de l'app).
 */
export const PREFIXE_FICTIF = 'fictif-';

/** Texte « rédigé par le serveur » dans la langue de l'app. */
export const texteServeur = (fr: string, en: string) => (i18n.language === 'fr' ? fr : en);

export function recordsFictifs(): RecordJalon[] {
  return [
    {
      id: `${PREFIXE_FICTIF}record-squat`,
      nature: 'record',
      date: ilYa(4),
      titre: texteServeur('Squat barre · 1RM estimé', 'Barbell squat · estimated 1RM'),
      valeur: 112.5,
      unite: 'kg',
      precedent: { valeur: 107.5, date: ilYa(38) },
      origine: { type: 'seance', id: `${PREFIXE_FICTIF}seance-1` },
    },
    {
      id: `${PREFIXE_FICTIF}jalon-50`,
      nature: 'jalon',
      date: ilYa(9),
      titre: texteServeur('50e séance terminée', '50th session completed'),
      valeur: null,
      unite: null,
      precedent: null,
      origine: { type: 'seance', id: `${PREFIXE_FICTIF}seance-2` },
    },
    {
      id: `${PREFIXE_FICTIF}record-vma`,
      nature: 'record',
      date: ilYa(16),
      titre: texteServeur('VMA (test de terrain)', 'MAS (field test)'),
      valeur: 17.5,
      unite: 'km/h',
      precedent: { valeur: 16.8, date: ilYa(104) },
      origine: { type: 'test', id: `${PREFIXE_FICTIF}test-1` },
    },
    {
      id: `${PREFIXE_FICTIF}jalon-bloc`,
      nature: 'jalon',
      date: ilYa(23),
      titre: texteServeur('Premier bloc du programme terminé', 'First programme block completed'),
      valeur: null,
      unite: null,
      precedent: null,
      origine: { type: 'programme', id: `${PREFIXE_FICTIF}bloc-1` },
    },
    {
      id: `${PREFIXE_FICTIF}record-cmj`,
      nature: 'record',
      date: ilYa(41),
      titre: texteServeur('Saut vertical (CMJ)', 'Vertical jump (CMJ)'),
      valeur: 46,
      unite: 'cm',
      precedent: { valeur: 43, date: ilYa(97) },
      origine: { type: 'test', id: `${PREFIXE_FICTIF}test-2` },
    },
  ];
}

function groupe(effectif: number): GroupeComparaison {
  return {
    niveau: 'amateur',
    tranche_age: '25-34',
    sexe: 'homme',
    sport: { slug: 'boxe_anglaise', nom: texteServeur('Boxe anglaise', 'Boxing') },
    effectif,
  };
}

export function niveauxFictifs(): Niveaux {
  return {
    qualites: [
      {
        qualite: 'vma',
        libelle: texteServeur('VMA', 'MAS'),
        percentile: 72,
        valeur: 17.5,
        unite: 'km/h',
        test: { slug: 'vma', date: ilYa(16), methode: 'teste' },
        groupe: groupe(1240),
      },
      {
        qualite: 'force_relative',
        libelle: texteServeur('Force relative', 'Relative strength'),
        percentile: 64,
        valeur: 1.5,
        unite: texteServeur('× poids du corps', '× body weight'),
        test: { slug: '1rm', date: ilYa(4), methode: 'estime_seance' },
        groupe: groupe(980),
      },
      {
        qualite: 'detente',
        libelle: texteServeur('Détente', 'Jumping power'),
        percentile: 58,
        valeur: 46,
        unite: 'cm',
        test: { slug: 'cmj', date: ilYa(41), methode: 'teste' },
        groupe: groupe(610),
      },
      {
        qualite: 'vitesse',
        libelle: texteServeur('Vitesse', 'Speed'),
        percentile: 41,
        valeur: 4.62,
        unite: 's',
        test: { slug: 'sprint_30m', date: ilYa(55), methode: 'teste' },
        groupe: groupe(450),
      },
    ],
    manquantes: [
      {
        qualite: 'endurance',
        libelle: texteServeur('Endurance', 'Endurance'),
        test_conseille: { slug: 'cooper', nom: texteServeur('Test de Cooper (12 min)', 'Cooper test (12 min)') },
      },
    ],
  };
}

/** Fin d'une période fictive à partir d'aujourd'hui. */
export const dansJours = (jours: number) => ajouterJours(ilYa(0), jours);

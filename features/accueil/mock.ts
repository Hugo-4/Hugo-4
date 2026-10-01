import type { Accueil, JourSemaine, StatutJour } from './types';

/**
 * Données fictives de l'écran Aujourd'hui (étape 1).
 * Remplacées à l'étape 4 par `GET /accueil` et `GET /nutrition/jour`.
 *
 * Pour tester les variantes, change `SCENARIO` :
 * - 'normal'  : check-in fait, carte fatigue avec proposition, séance du jour
 * - 'checkin' : check-in du jour pas encore fait
 * - 'repos'   : jour de repos
 * - 'vide'    : aucun programme
 * - 'erreur'  : le chargement échoue
 */
export type Scenario = 'normal' | 'checkin' | 'repos' | 'vide' | 'erreur';
export const SCENARIO: Scenario = 'normal';

const TYPES = ['Force', 'Course', 'Repos', 'Force', 'Mobilité', 'Fractionné', 'Repos'];

function isoLocal(date: Date): string {
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const j = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${m}-${j}`;
}

/** Semaine du lundi au dimanche contenant aujourd'hui. */
function semaineEnCours(aujourdhui: Date): JourSemaine[] {
  const lundi = new Date(aujourdhui);
  lundi.setDate(aujourdhui.getDate() - ((aujourdhui.getDay() + 6) % 7));
  return TYPES.map((type, i) => {
    const date = new Date(lundi);
    date.setDate(lundi.getDate() + i);
    const iso = isoLocal(date);
    const isoJour = isoLocal(aujourdhui);
    let statut: StatutJour = type === 'Repos' ? 'repos' : iso < isoJour ? 'fait' : 'prevu';
    if (iso === isoJour) statut = 'aujourdhui';
    return { date: iso, statut, type };
  });
}

function demain(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return isoLocal(d);
}

const accueilNormal: Accueil = {
  athlete: { prenom: 'Hugo', initiales: 'HM', notificationsNonLues: 3 },
  forme: {
    checkinFait: true,
    score: 78,
    libelle: "Prêt à t'entraîner",
    sommeilMinutes: 462,
    hrv: 68,
    hrvEcart: 4,
    ressenti: 'Bon',
    messageCoach:
      "Bonne récupération cette nuit : on garde la charge prévue, mais on réduit d'une série le dernier exercice pour ménager tes ischios.",
  },
  fatigue: {
    message:
      'Ta fatigue monte depuis 4 jours (sommeil court et courbatures). Je te propose une semaine allégée de 20 % pour repartir plus fort.',
    proposition: { id: 'adaptation-mock-1' },
    seanceRemplacee: null,
  },
  seance: {
    id: 'seance-mock-1',
    bloc: 2,
    semaine: 3,
    semainesTotal: 8,
    serieSemaines: 5,
    titre: 'Force · bas du corps',
    dureeMinutes: 65,
    rpeCible: 8,
    nombreExercices: 6,
    lieu: 'Salle',
    exercices: [
      { nom: 'Squat arrière', prescription: '4 × 5 · 120 kg · RIR 2' },
      { nom: 'Soulevé de terre roumain', prescription: '3 × 8 · 90 kg · RIR 2' },
      { nom: 'Fentes bulgares', prescription: '3 × 10 / jambe · 2 × 20 kg' },
    ],
  },
  prochaineSeance: null,
  semaine: { jours: [], charge: { niveau: 'optimale', position: 0.55 } },
  nutrition: {
    calories: { valeur: 1840, objectif: 2900 },
    proteines: { valeur: 112, objectif: 165 },
    glucides: { valeur: 210, objectif: 360 },
    eau: { valeur: 1.6, objectif: 3 },
    frequents: ['Skyr', 'Banane', 'Flocons d’avoine'],
  },
  record: { texte: 'Squat arrière : 125 kg × 3, nouveau record (+5 kg) il y a 6 jours.' },
};

export function accueilMock(scenario: Scenario = SCENARIO): Accueil | null {
  const base: Accueil = {
    ...accueilNormal,
    semaine: accueilNormal.semaine && { ...accueilNormal.semaine, jours: semaineEnCours(new Date()) },
  };
  switch (scenario) {
    case 'checkin':
      return { ...base, fatigue: null, forme: { ...base.forme, checkinFait: false } };
    case 'repos':
      return {
        ...base,
        fatigue: null,
        seance: null,
        prochaineSeance: { titre: 'Fractionné court', date: demain() },
      };
    case 'vide':
      return null;
    default:
      return base;
  }
}

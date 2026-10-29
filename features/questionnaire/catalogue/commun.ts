import {
  contexteVie,
  JOURS_SEMAINE,
  OUI_NON,
  profil,
  profilCorrespondance,
  profilOuiNon,
  signalEffort,
  sport,
  styleCoaching,
  table,
  tableCorrespondance,
  tableJours,
  tableListe,
  tableOuiNon,
} from '../destinations';
import type { Question } from '../types';

/** Mon corps : taille, poids (obligatoire), latéralité, journée, sommeil, stress. */
export const CORPS: Question[] = [
  { id: 'TC09', section: 'corps', type: 'nombre', nombre: { min: 100, max: 230, unite: 'cm' }, destination: profil('taille_cm') },
  {
    id: 'TC10',
    section: 'corps',
    type: 'nombre',
    nombre: { min: 30, max: 250, unite: 'kg', decimal: true },
    // Obligatoire pour tous dès l'inscription (décision du 26/10/2026) : jamais commenté chez un mineur.
    obligatoire: true,
    destination: { kind: 'poids' },
  },
  { id: 'TC11', section: 'corps', type: 'unique', options: ['droitier', 'gaucher', 'ambidextre'], destination: profil('lateralite') },
  {
    id: 'TC48',
    section: 'corps',
    type: 'unique',
    options: ['assis', 'debout', 'physique', 'tres_physique'],
    destination: profilCorrespondance('activite_quotidienne', {
      assis: 'sedentaire',
      debout: 'legere',
      physique: 'active',
      tres_physique: 'tres_active',
    }),
  },
  {
    id: 'TC125',
    section: 'corps',
    type: 'unique',
    options: ['moins_6h', 'h6_7', 'h7_8', 'h8_9', 'plus_9h'],
    destination: profilCorrespondance('sommeil_heures_habituel', { moins_6h: 5.5, h6_7: 6.5, h7_8: 7.5, h8_9: 8.5, plus_9h: 9.5 }),
  },
  {
    id: 'TC127',
    section: 'corps',
    type: 'unique',
    options: ['n1', 'n2', 'n3', 'n4', 'n5'],
    destination: profilCorrespondance('niveau_stress_habituel', { n1: 1, n2: 2, n3: 3, n4: 4, n5: 5 }),
  },
];

/** Niveau et historique sportif (TC41 à TC47). */
export const HISTORIQUE: Question[] = [
  {
    id: 'TC41',
    section: 'historique',
    type: 'unique',
    options: ['moins_6_mois', 'mois_6_12', 'ans_1_3', 'ans_3_5', 'plus_5_ans'],
    destination: profilCorrespondance('annees_pratique', { moins_6_mois: 0.25, mois_6_12: 0.75, ans_1_3: 2, ans_3_5: 4, plus_5_ans: 6 }),
  },
  { id: 'TC42', section: 'historique', type: 'nombre', nombre: { min: 0, max: 14, unite: 'parSemaine' }, destination: contexteVie('seances_semaine_recentes') },
  {
    id: 'TC43',
    section: 'historique',
    type: 'unique',
    options: ['m20', 'm30', 'm45', 'm60', 'm75', 'm90', 'm120'],
    si: (c) => c.valeurs.TC42 !== 0,
    destination: profilCorrespondance('duree_seance_minutes', { m20: 20, m30: 30, m45: 45, m60: 60, m75: 75, m90: 90, m120: 120 }),
  },
  { id: 'TC44', section: 'historique', type: 'unique', options: ['non', 'mois_1_3', 'mois_3_6', 'plus_6_mois'], destination: contexteVie('arret_recent') },
  {
    id: 'TC44B',
    section: 'historique',
    type: 'unique',
    options: ['blessure', 'travail', 'motivation', 'maladie', 'autre'],
    si: (c) => c.valeurs.TC44 !== undefined && c.valeurs.TC44 !== 'non',
    destination: contexteVie('arret_raison'),
  },
  {
    id: 'TC46',
    section: 'historique',
    type: 'unique',
    options: ['jamais', 'appli', 'programme_papier', 'coach_salle', 'club'],
    destination: contexteVie('experience_coaching'),
  },
  {
    id: 'TC47',
    section: 'historique',
    type: 'unique',
    options: ['jamais', 'quelques_unes', 'regulierement', 'national'],
    si: (c) => c.ambition !== 'plaisir',
    destination: sport('experience_competition'),
  },
];

/** Organisation : repos, accès, contraintes (heures et lieux : Profil → Disponibilités et Lieux). */
export const ORGANISATION: Question[] = [
  { id: 'TC64', section: 'organisation', type: 'multiple', options: JOURS_SEMAINE, destination: tableJours('preferences_athlete', 'jours_repos_preferes') },
  { id: 'TC71A', section: 'organisation', type: 'unique', options: OUI_NON, destination: profilOuiNon('acces_piscine') },
  { id: 'TC71B', section: 'organisation', type: 'unique', options: OUI_NON, destination: profilOuiNon('acces_velo') },
  { id: 'TC71C', section: 'organisation', type: 'unique', options: OUI_NON, destination: profilOuiNon('acces_piste') },
  {
    id: 'TC73',
    section: 'organisation',
    type: 'multiple',
    options: ['horaires_decales', 'travail_nuit', 'deplacements', 'enfants', 'etudes', 'aucun'],
    destination: contexteVie('contraintes'),
  },
];

/** Santé (seulement avec le consentement) : sécurité avant l'effort et mouvements douloureux. */
export const SANTE: Question[] = [
  { id: 'TC80', section: 'sante', type: 'unique', options: OUI_NON, sante: true, destination: signalEffort('avis_medical_coeur') },
  { id: 'TC81', section: 'sante', type: 'unique', options: OUI_NON, sante: true, destination: signalEffort('malaise_effort') },
  {
    id: 'TC82',
    section: 'sante',
    type: 'unique',
    options: OUI_NON,
    sante: true,
    destination: {
      kind: 'table',
      table: 'sante_athlete',
      colonne: 'medicaments',
      versBase: (v) => (v === 'oui' ? ['traitement_declare'] : []),
      depuisBase: (v) => (Array.isArray(v) ? (v.length ? 'oui' : 'non') : undefined),
    },
  },
  {
    id: 'TC83',
    section: 'sante',
    type: 'multiple',
    options: ['asthme', 'diabete', 'epilepsie', 'cardiaque', 'autre', 'aucun'],
    sante: true,
    destination: tableListe('sante_athlete', 'pathologies_chroniques'),
  },
  {
    id: 'TC92',
    section: 'sante',
    type: 'multiple',
    options: ['accroupir', 'courir', 'sauter', 'au_dessus_tete', 'pousser', 'tirer', 'pencher', 'frapper', 'tourner', 'aucun'],
    sante: true,
    destination: {
      kind: 'profil',
      colonne: 'contre_indications',
      versBase: (v) => (Array.isArray(v) ? v.filter((x) => x !== 'aucun') : []),
      depuisBase: (v) => (Array.isArray(v) ? (v.length ? (v as string[]) : ['aucun']) : undefined),
    },
  },
];

/** Nutrition de base (le détail des calories et des macros est dans le module Nutrition). */
export const NUTRITION: Question[] = [
  {
    id: 'TC110',
    section: 'nutrition',
    type: 'unique',
    options: ['omnivore', 'flexitarien', 'pescetarien', 'vegetarien', 'vegan'],
    destination: table('preferences_nutrition', 'regime'),
  },
  {
    id: 'TC111',
    section: 'nutrition',
    type: 'multiple',
    options: ['halal', 'casher', 'sans_porc', 'jeune_religieux', 'aucun'],
    destination: tableListe('preferences_nutrition', 'contraintes_religieuses'),
  },
  {
    id: 'TC112',
    section: 'nutrition',
    type: 'multiple',
    options: ['gluten', 'lactose', 'arachide', 'fruits_coque', 'oeuf', 'poisson', 'crustaces', 'soja', 'sesame', 'aucun'],
    sante: true,
    destination: tableListe('sante_athlete', 'allergies'),
  },
  { id: 'TC114', section: 'nutrition', type: 'nombre', nombre: { min: 2, max: 6, unite: 'repas' }, destination: table('preferences_nutrition', 'repas_par_jour') },
  { id: 'TC114B', section: 'nutrition', type: 'unique', options: OUI_NON, destination: tableOuiNon('preferences_nutrition', 'collations') },
  { id: 'TC115', section: 'nutrition', type: 'unique', options: ['non', 'j16_8', 'autre'], destination: table('preferences_nutrition', 'jeune_intermittent') },
  {
    id: 'TC119',
    section: 'nutrition',
    type: 'multiple',
    options: ['whey', 'creatine', 'cafeine', 'vitamine_d', 'fer', 'magnesium', 'omega_3', 'autre', 'aucun'],
    destination: tableListe('preferences_nutrition', 'complements'),
  },
];

const TYPES_SEANCE = ['courtes_intenses', 'longues_regulieres', 'technique', 'force', 'cardio', 'circuits', 'nature', 'jeux'];

/** Préférences, style de coaching et motivation (TC130 à TC141). */
export const PREFERENCES: Question[] = [
  { id: 'TC130', section: 'preferences', type: 'multiple', options: TYPES_SEANCE, destination: table('preferences_athlete', 'types_seance_aimes') },
  {
    id: 'TC131',
    section: 'preferences',
    type: 'multiple',
    options: [...TYPES_SEANCE, 'aucun'],
    destination: tableListe('preferences_athlete', 'types_seance_evites'),
  },
  {
    id: 'TC132',
    section: 'preferences',
    type: 'unique',
    options: ['v1', 'v2', 'v3', 'v4', 'v5'],
    destination: profilCorrespondance('preference_variete', { v1: 1, v2: 2, v3: 3, v4: 4, v5: 5 }),
  },
  {
    id: 'TC133',
    section: 'preferences',
    type: 'unique',
    options: ['deteste', 'ca_va', 'aime'],
    destination: tableCorrespondance('preferences_athlete', 'tolerance_courbatures', { deteste: 1, ca_va: 3, aime: 5 }),
  },
  { id: 'TC134A', section: 'preferences', type: 'unique', options: OUI_NON, destination: tableOuiNon('preferences_athlete', 'aime_les_tests') },
  { id: 'TC134B', section: 'preferences', type: 'unique', options: OUI_NON, destination: tableOuiNon('preferences_athlete', 'aime_la_competition') },
  {
    id: 'TC135',
    section: 'preferences',
    type: 'unique',
    options: ['pas_a_pas', 'liste', 'video'],
    destination: tableCorrespondance('preferences_athlete', 'guidage', { pas_a_pas: 'texte', liste: 'minimal', video: 'video' }),
  },
  // Codes déjà utilisés par l'inscription (`style_coaching.ton` et `longueur`).
  { id: 'TC136', section: 'preferences', type: 'unique', options: ['bienveillant', 'strict', 'equilibre'], destination: styleCoaching('ton') },
  { id: 'TC137', section: 'preferences', type: 'unique', options: ['bref', 'standard', 'detaille'], destination: styleCoaching('longueur') },
  { id: 'TC138', section: 'preferences', type: 'unique', options: ['reorganise', 'propose', 'relance'], destination: styleCoaching('relance') },
  {
    id: 'TC139',
    section: 'preferences',
    type: 'multiple',
    max: 3,
    options: ['chiffres', 'bien_etre', 'apparence', 'competition', 'sante', 'defi', 'groupe'],
    destination: table('preferences_athlete', 'motivations'),
  },
  {
    id: 'TC140',
    section: 'preferences',
    type: 'multiple',
    options: ['temps', 'ennui', 'blessure', 'fatigue', 'resultats', 'seul', 'cout', 'jamais_arrete'],
    destination: table('preferences_athlete', 'freins'),
  },
];

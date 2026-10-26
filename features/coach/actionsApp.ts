import type { Href } from 'expo-router';

/**
 * Actions sur l'app que le coach peut proposer sous sa réponse (questions générales : « passe l'app en
 * anglais », « où est mon abonnement ? »). L'app les exécute elle-même, après confirmation pour un réglage.
 * Format dans `messages_coach.actions` : docs/MANQUES-SERVEUR.md §9.
 */
export const ECRANS_APP = [
  'abonnement',
  'preferences',
  'disponibilites',
  'lieux',
  'objectifs',
  'mon_objectif',
  'corps',
  'questionnaire',
  'consentements',
  'notifications',
  'memoire',
  'donnees',
  'progres',
  'programme',
  'checkin',
] as const;
export type EcranApp = (typeof ECRANS_APP)[number];

export type ActionApp = { type: 'langue'; langue: 'fr' | 'en' } | { type: 'ouvrir'; ecran: EcranApp };

/** Écran de l'app ouvert par une action « ouvrir ». */
export const ROUTES_ECRANS: Record<EcranApp, Href> = {
  abonnement: '/compte/abonnement',
  preferences: '/compte/preferences',
  disponibilites: '/compte/disponibilites',
  lieux: '/compte/lieux',
  objectifs: '/compte/objectifs',
  mon_objectif: '/programme/objectifs',
  corps: '/compte/corps',
  questionnaire: '/questionnaire',
  consentements: '/compte/consentements',
  notifications: '/notifications',
  memoire: '/compte/memoire',
  donnees: '/compte/donnees',
  progres: '/progres',
  programme: '/programme',
  checkin: '/checkin',
};

/** Lit une action de la colonne `actions` ; une action inconnue ou mal formée est ignorée. */
export function lireActionApp(action: Record<string, unknown>): ActionApp | null {
  if (action.type === 'langue' && (action.langue === 'fr' || action.langue === 'en')) return { type: 'langue', langue: action.langue };
  if (action.type === 'ouvrir') {
    const ecran = ECRANS_APP.find((e) => e === action.ecran);
    return ecran ? { type: 'ouvrir', ecran } : null;
  }
  return null;
}

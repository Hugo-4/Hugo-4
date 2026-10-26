import i18n from '@/lib/i18n';

import type { CentreNotifications, NotificationCentre } from './types';

/**
 * Notifications fictives au format de GET /notifications/centre (textes « du serveur » en français
 * et en anglais). L'état « lu » vit en mémoire le temps de la session.
 */
const IL_Y_A = (minutes: number) => new Date(Date.now() - minutes * 60_000).toISOString();

type Modele = Omit<NotificationCentre, 'titre' | 'corps' | 'cree_le'> & {
  minutes: number;
  fr: [string, string];
  en: [string, string];
};

const MODELES: Modele[] = [
  {
    id: 'fictif-notif-1',
    type: 'proposition_coach',
    lue: false,
    minutes: 25,
    cible: { ecran: 'coach' },
    fr: ['Le coach te propose une modification', 'Séance de jeudi raccourcie à 45 min : réponds dans le chat.'],
    en: ['The coach suggests a change', "Thursday's session shortened to 45 min: reply in the chat."],
  },
  {
    id: 'fictif-notif-2',
    type: 'adaptation_semaine',
    lue: false,
    minutes: 180,
    cible: { ecran: 'aujourdhui' },
    fr: ['Ta semaine peut être allégée', 'Fatigue élevée depuis 3 jours : choisis sur Aujourd’hui.'],
    en: ['Your week can be lightened', 'High fatigue for 3 days: choose on Today.'],
  },
  {
    id: 'fictif-notif-3',
    type: 'rappel_checkin',
    lue: true,
    minutes: 60 * 26,
    cible: { ecran: 'checkin' },
    fr: ['Check-in du matin', '30 secondes pour adapter ta séance du jour.'],
    en: ['Morning check-in', '30 seconds to adapt today’s session.'],
  },
  {
    id: 'fictif-notif-4',
    type: 'competition_proche',
    lue: true,
    minutes: 60 * 50,
    cible: { ecran: 'programme' },
    fr: ['Compétition dans 3 semaines', 'Ton programme entre en phase d’affûtage.'],
    en: ['Competition in 3 weeks', 'Your plan is entering its taper phase.'],
  },
  {
    id: 'fictif-notif-5',
    type: 'nouveau_record',
    lue: true,
    minutes: 60 * 72,
    cible: { ecran: 'records' },
    fr: ['Nouveau record', 'Squat barre : 5 × 100 kg.'],
    en: ['New record', 'Barbell squat: 5 × 100 kg.'],
  },
];

const lues = new Set(MODELES.filter((m) => m.lue).map((m) => m.id));

export function centreFictif(): CentreNotifications {
  const anglais = i18n.language === 'en';
  const notifications = MODELES.map(({ minutes, fr, en, ...reste }) => {
    const [titre, corps] = anglais ? en : fr;
    return { ...reste, titre, corps, cree_le: IL_Y_A(minutes), lue: lues.has(reste.id) };
  });
  return { non_lues: notifications.filter((n) => !n.lue).length, notifications };
}

export function marquerLueFictive(id: string) {
  lues.add(id);
}

export function marquerToutLuFictif() {
  MODELES.forEach((m) => lues.add(m.id));
}

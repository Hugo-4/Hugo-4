/** Centre de notifications (route manquante, docs/MANQUES-SERVEUR.md §6). */

export const TYPES_NOTIFICATION = [
  'proposition_coach',
  'adaptation_semaine',
  'rappel_checkin',
  'competition_proche',
  'nouveau_record',
] as const;
export type TypeNotification = (typeof TYPES_NOTIFICATION)[number];

/** Écran ouvert quand on touche la notification (choisi par le serveur, l'app ne fait que naviguer). */
export type EcranCible = 'coach' | 'aujourdhui' | 'checkin' | 'programme' | 'adaptations' | 'evenement' | 'seance' | 'records';

export type NotificationCentre = {
  id: string;
  type: TypeNotification | string;
  /** Rédigés par le serveur, dans la langue de l'athlète. */
  titre: string;
  corps: string | null;
  /** ISO. */
  cree_le: string;
  lue: boolean;
  cible: { ecran: EcranCible; id?: string | null } | null;
};

/** GET /notifications/centre */
export type CentreNotifications = {
  non_lues: number;
  notifications: NotificationCentre[];
};

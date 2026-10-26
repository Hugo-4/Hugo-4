import { router } from 'expo-router';

import { ouvrirCoach } from '@/features/coach/ouvrirCoach';

import type { EcranCible, NotificationCentre } from './types';

/** Écran par défaut de chaque type, si le serveur n'en indique pas. */
const ECRAN_PAR_TYPE: Record<string, EcranCible> = {
  proposition_coach: 'coach',
  adaptation_semaine: 'aujourdhui',
  rappel_checkin: 'checkin',
  competition_proche: 'programme',
  nouveau_record: 'records',
};

/** Ouvre l'écran concerné par la notification. Renvoie `false` s'il n'y en a pas. */
export function ouvrirDestination(notification: NotificationCentre): boolean {
  const ecran = notification.cible?.ecran ?? ECRAN_PAR_TYPE[notification.type];
  const id = notification.cible?.id ?? null;
  switch (ecran) {
    case 'coach':
      ouvrirCoach();
      return true;
    case 'aujourdhui':
      router.navigate('/');
      return true;
    case 'checkin':
      router.push('/checkin');
      return true;
    case 'programme':
      router.navigate('/programme');
      return true;
    case 'adaptations':
      router.push('/programme/adaptations');
      return true;
    case 'evenement':
      if (id) router.push({ pathname: '/programme/evenement/[id]', params: { id } });
      else router.navigate('/programme');
      return true;
    case 'seance':
      if (id) router.push({ pathname: '/programme/seance/[id]', params: { id } });
      else router.navigate('/programme');
      return true;
    case 'records':
      router.push({ pathname: '/progres/[vue]', params: { vue: 'records' } });
      return true;
    default:
      return false;
  }
}

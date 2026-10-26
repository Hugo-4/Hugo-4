import { useCentreNotifications } from './useNotifications';

/** Nombre de notifications non lues (compteur de la cloche d'Aujourd'hui). 0 tant que rien n'est chargé. */
export function useNombreNonLues(): number {
  const centre = useCentreNotifications();
  return centre.data?.notifications.filter((n) => !n.lue).length ?? 0;
}

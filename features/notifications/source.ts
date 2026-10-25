import { api } from '@/lib/api';

import { centreFictif, marquerLueFictive, marquerToutLuFictif } from './mockNotifications';
import type { CentreNotifications } from './types';

/**
 * Centre de notifications avec état « lu ». La route existante GET /notifications ne donne que les rappels
 * planifiés (sans état « lu ») : tant que GET /notifications/centre manque, la liste est fictive (même format).
 * Passer `NOTIFICATIONS_FICTIF` à false quand les routes sont en ligne (docs/manques/profil.md).
 */
export const NOTIFICATIONS_FICTIF = true;

const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function lireCentre(): Promise<CentreNotifications> {
  if (NOTIFICATIONS_FICTIF) {
    await attendre(300);
    return centreFictif();
  }
  return api.get<CentreNotifications>('/notifications/centre?limite=50');
}

export async function marquerLue(id: string): Promise<void> {
  if (NOTIFICATIONS_FICTIF) {
    await attendre(150);
    marquerLueFictive(id);
    return;
  }
  await api.patch(`/notifications/centre/${id}`, { lue: true });
}

export async function marquerToutLu(): Promise<void> {
  if (NOTIFICATIONS_FICTIF) {
    await attendre(200);
    marquerToutLuFictif();
    return;
  }
  await api.post('/notifications/centre/tout-lu');
}

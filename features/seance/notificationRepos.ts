import { Platform } from 'react-native';

import i18n from '@/lib/i18n';

/**
 * Notification LOCALE de fin de repos (aucune notification push). Un identifiant fixe : programmer
 * à nouveau remplace l'ancienne, annuler ne demande rien d'autre à stocker, même après redémarrage.
 */
const IDENTIFIANT = 'athlenis-fin-repos';
const CANAL = 'repos';

type ModuleNotifications = typeof import('expo-notifications');
let moduleNotif: ModuleNotifications | null | undefined;

/**
 * `expo-notifications` est chargé seulement au premier usage : dans Expo Go sur Android, l'importer plante
 * (module natif absent) et ferait tomber tous les écrans qui l'importent. Indisponible : `null`, on s'en passe.
 */
function notifications(): ModuleNotifications | null {
  if (moduleNotif !== undefined) return moduleNotif;
  try {
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    moduleNotif = require('expo-notifications') as ModuleNotifications;
    // L'athlète a l'app sous les yeux : la vibration de l'écran suffit, on n'affiche pas la notification.
    moduleNotif.setNotificationHandler({
      handleNotification: async (notification) => {
        const nous = notification.request.identifier === IDENTIFIANT;
        return { shouldShowBanner: !nous, shouldShowList: !nous, shouldPlaySound: !nous, shouldSetBadge: false };
      },
    });
  } catch {
    moduleNotif = null;
  }
  return moduleNotif;
}

let autorisation: Promise<boolean> | null = null;
let file: Promise<void> = Promise.resolve();

/** Une opération à la fois : deux « +15 s » rapides ne laissent jamais deux notifications. */
function enSerie(operation: () => Promise<void>): Promise<void> {
  file = file.then(operation, operation);
  return file;
}

/** Canal Android et permission, demandée une seule fois, au premier repos. */
async function preparer(): Promise<boolean> {
  const Notifications = notifications();
  if (!Notifications) return false;
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync(CANAL, {
      name: i18n.t('enSeance.notification.canal'),
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 400, 150, 400],
    });
  }
  const actuelle = await Notifications.getPermissionsAsync();
  if (actuelle.granted) return true;
  if (!actuelle.canAskAgain) return false;
  return (await Notifications.requestPermissionsAsync()).granted;
}

function autorise(): Promise<boolean> {
  if (Platform.OS === 'web') return Promise.resolve(false);
  autorisation ??= preparer().catch(() => false);
  return autorisation;
}

async function annuler(): Promise<void> {
  const Notifications = Platform.OS === 'web' ? null : notifications();
  if (!Notifications) return;
  await Notifications.cancelScheduledNotificationAsync(IDENTIFIANT).catch(() => undefined);
}

export function annulerFinRepos(): Promise<void> {
  return enSerie(annuler);
}

/** Programme (ou reprogramme) la notification à l'heure de fin du repos. */
export function programmerFinRepos(fin: number, texte: string): Promise<void> {
  return enSerie(async () => {
    if (!(await autorise())) return;
    await annuler();
    const secondes = Math.round((fin - Date.now()) / 1000);
    const Notifications = notifications();
    if (secondes < 1 || !Notifications) return;
    await Notifications.scheduleNotificationAsync({
      identifier: IDENTIFIANT,
      content: { title: i18n.t('enSeance.notification.titre'), body: texte, sound: true },
      trigger: { type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, seconds: secondes, channelId: CANAL },
    }).catch(() => undefined);
  });
}

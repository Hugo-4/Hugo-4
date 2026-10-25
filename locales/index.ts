import en from './en.json';
import enCoach from './en/coach.json';
import enNotifications from './en/notifications.json';
import enParametres from './en/parametres.json';
import enProgramme from './en/programme.json';
import enProgres from './en/progres.json';
import fr from './fr.json';
import frCoach from './fr/coach.json';
import frNotifications from './fr/notifications.json';
import frParametres from './fr/parametres.json';
import frProgramme from './fr/programme.json';
import frProgres from './fr/progres.json';

/**
 * Traductions de l'app. Étapes 1 à 5 : `fr.json` / `en.json`. Étapes 6 à 9 : un fichier par domaine
 * (`fr/<domaine>.json`), rangé sous la clé du domaine (`coach.*`, `programme.*`…).
 */
export const traductionsFr = {
  ...fr,
  coach: frCoach,
  programme: frProgramme,
  progres: frProgres,
  parametres: frParametres,
  notifications: frNotifications,
};

export type Traductions = typeof traductionsFr;

/** L'anglais doit avoir toutes les clés du français : tsc échoue sinon (et scripts/verifier-front.mjs). */
export const traductionsEn: Traductions = {
  ...en,
  coach: enCoach,
  programme: enProgramme,
  progres: enProgres,
  parametres: enParametres,
  notifications: enNotifications,
};

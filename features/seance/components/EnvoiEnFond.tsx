import { useFileEnvoi } from '../useFileEnvoi';

/** Rejoue la file d'envoi au démarrage et au retour du réseau, même hors de l'écran En séance. */
export function EnvoiEnFond() {
  useFileEnvoi();
  return null;
}

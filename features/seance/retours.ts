import * as Haptics from 'expo-haptics';
import { Vibration } from 'react-native';

/** Retours physiques de la séance (FRONTEND.md §5.4) : validation de série et fin de repos, pas ailleurs. */
export function vibrerValidation() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

export function vibrerFinRepos() {
  Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success).catch(() => undefined);
  // Téléphone posé sur le banc : un retour haptique seul passe inaperçu, on ajoute une vraie vibration.
  Vibration.vibrate([0, 400, 150, 400]);
}

import { Vibration } from 'react-native';

/**
 * Retours physiques de la séance. Vibreur intégré de React Native en attendant `expo-haptics`
 * (proposé, pas encore installé) : seule cette fonction changera.
 */
export function vibrerValidation() {
  Vibration.vibrate(30);
}

export function vibrerFinRepos() {
  Vibration.vibrate([0, 400, 150, 400]);
}

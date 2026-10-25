import * as Haptics from 'expo-haptics';

/**
 * Vibration légère quand une proposition du coach est appliquée : la seule vibration du Coach
 * (FRONTEND.md §5.4 : validation de série, fin de repos, application d'une proposition, pas ailleurs).
 */
export function vibrerApplication() {
  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light).catch(() => undefined);
}

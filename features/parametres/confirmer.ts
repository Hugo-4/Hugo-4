import { Alert } from 'react-native';

import i18n from '@/lib/i18n';

/** Confirmation native avant une action destructrice (suppression d'un lieu, d'un souvenir…). */
export function confirmer({ titre, texte, action, onConfirmer }: { titre: string; texte: string; action: string; onConfirmer: () => void }) {
  Alert.alert(titre, texte, [
    { text: i18n.t('commun.annuler'), style: 'cancel' },
    { text: action, style: 'destructive', onPress: onConfirmer },
  ]);
}

import { Alert } from 'react-native';

import i18n from './i18n';

/** Action pas encore branchée (étapes suivantes du plan). */
export function bientot() {
  Alert.alert(i18n.t('commun.bientotTitre'), i18n.t('commun.bientotTexte'));
}

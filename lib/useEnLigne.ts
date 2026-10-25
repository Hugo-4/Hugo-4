import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';

/** `false` seulement quand le téléphone sait qu'il n'a pas de réseau (état inconnu = en ligne). */
export function useEnLigne(): boolean {
  const [enLigne, setEnLigne] = useState(true);
  useEffect(() => NetInfo.addEventListener((etat) => setEnLigne(etat.isConnected !== false)), []);
  return enLigne;
}

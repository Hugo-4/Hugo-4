import { useEffect, useState } from 'react';
import { Keyboard, Platform } from 'react-native';

/** Clavier ouvert : la saisie colle au clavier au lieu de garder la marge du bas de l'écran. */
export function useClavierVisible(): boolean {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const ios = Platform.OS === 'ios';
    const montre = Keyboard.addListener(ios ? 'keyboardWillShow' : 'keyboardDidShow', () => setVisible(true));
    const cache = Keyboard.addListener(ios ? 'keyboardWillHide' : 'keyboardDidHide', () => setVisible(false));
    return () => {
      montre.remove();
      cache.remove();
    };
  }, []);
  return visible;
}

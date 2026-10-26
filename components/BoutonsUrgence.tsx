import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { spacing } from '@/theme/tokens';

import { Button } from './Button';

const NUMEROS = ['15', '112'] as const;

const appeler = (numero: string) => {
  Linking.openURL(`tel:${numero}`).catch(() => undefined);
};

/** « Appeler le 15 » et « Appeler le 112 » : chaque bouton compose le numéro. */
export function BoutonsUrgence() {
  const { t } = useTranslation();
  return (
    <View style={styles.boutons}>
      {NUMEROS.map((numero) => (
        <Button
          key={numero}
          variant="danger"
          label={t('commun.appelerNumero', { numero })}
          onPress={() => appeler(numero)}
          style={styles.bouton}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  boutons: { flexDirection: 'row', gap: spacing.s },
  bouton: { flex: 1 },
});

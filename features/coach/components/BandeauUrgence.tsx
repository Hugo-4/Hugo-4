import { TriangleAlert } from 'lucide-react-native';
import { Linking, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { colors, sizes, spacing } from '@/theme/tokens';

const NUMEROS = ['15', '112'] as const;

const appeler = (numero: string) => {
  Linking.openURL(`tel:${numero}`).catch(() => undefined);
};

/** Signes d'alerte repérés par le serveur : « Appelle le 15 ou le 112 », un bouton compose chaque numéro. */
export function BandeauUrgence() {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <Bandeau
        ton="urgence"
        icon={<TriangleAlert color={colors.danger} size={sizes.icone} />}
        texte={t('coach.urgence.texte')}
      />
      <View style={styles.boutons}>
        {NUMEROS.map((numero) => (
          <Button
            key={numero}
            variant="danger"
            label={t('coach.urgence.appeler', { numero })}
            onPress={() => appeler(numero)}
            style={styles.bouton}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  boutons: { flexDirection: 'row', gap: spacing.s },
  bouton: { flex: 1 },
});

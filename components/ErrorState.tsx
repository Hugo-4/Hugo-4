import { TriangleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { detailTechnique, useTexteErreur } from '@/lib/texteErreur';
import { colors, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { Button } from './Button';

type Props = {
  onRetry: () => void;
  /** Erreur reçue : sa cause remplace le message générique quand elle est connue. */
  erreur?: unknown;
};

export function ErrorState({ onRetry, erreur }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const detail = detailTechnique(erreur);
  return (
    <View style={styles.conteneur} accessibilityRole="alert">
      <TriangleAlert color={colors.alerte} size={sizes.icone * 2} />
      <AppText variant="sousTitre" style={styles.centre}>
        {t('commun.erreurTitre')}
      </AppText>
      <AppText variant="secondaire" style={styles.centre}>
        {texteErreur(erreur) ?? t('commun.erreurTexte')}
      </AppText>
      {detail ? (
        <AppText variant="libelle" style={styles.centre} selectable>
          {detail}
        </AppText>
      ) : null}
      <Button label={t('commun.reessayer')} onPress={onRetry} style={styles.bouton} />
    </View>
  );
}

const styles = StyleSheet.create({
  conteneur: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.m, padding: spacing.xxl },
  centre: { textAlign: 'center' },
  bouton: { alignSelf: 'stretch', marginTop: spacing.s },
});

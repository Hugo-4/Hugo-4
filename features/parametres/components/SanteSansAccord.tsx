import { router } from 'expo-router';
import { ShieldCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Sans consentement « données de santé » : une explication et le lien vers Consentements, aucune donnée lue. */
export function SanteSansAccord() {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <EmptyState
        icon={<ShieldCheck color={colors.discret} size={sizes.icone * 2} />}
        titre={t('parametres.sante.sansAccordTitre')}
        texte={t('parametres.sante.sansAccordTexte')}
      />
      <Button
        label={t('parametres.sante.voirConsentements')}
        variant="secondaire"
        onPress={() => router.push('/compte/consentements')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { flex: 1, gap: spacing.l, justifyContent: 'center' },
});

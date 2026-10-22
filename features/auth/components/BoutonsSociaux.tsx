import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors, sizes, spacing } from '@/theme/tokens';

import { cleErreurAuth } from '../erreurs';
import { useConnexionSociale } from '../useConnexionSociale';
import { MessageErreur } from './MessageErreur';

/** « Continuer avec Google / Apple » (Supabase OAuth). */
export function BoutonsSociaux() {
  const { t } = useTranslation();
  const sociale = useConnexionSociale();
  return (
    <View style={styles.bloc}>
      <View style={styles.separateur}>
        <View style={styles.trait} />
        <AppText variant="libelle">{t('auth.ou')}</AppText>
        <View style={styles.trait} />
      </View>
      {sociale.isError ? <MessageErreur texte={t(cleErreurAuth(sociale.error))} /> : null}
      <Button
        label={t('auth.google')}
        variant="secondaire"
        disabled={sociale.isPending}
        onPress={() => sociale.mutate('google')}
      />
      <Button
        label={t('auth.apple')}
        variant="secondaire"
        disabled={sociale.isPending}
        onPress={() => sociale.mutate('apple')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  separateur: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, marginVertical: spacing.xs },
  trait: { flex: 1, height: sizes.bordure, backgroundColor: colors.ligne },
});

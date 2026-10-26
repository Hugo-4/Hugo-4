import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { useTexteErreur } from '@/lib/texteErreur';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, spacing } from '@/theme/tokens';

import { useReponseProposition } from '../mutationsAdaptation';
import { AvisHorsLigne } from './AvisHorsLigne';

/** Adaptation en attente de réponse : [S] « Accepter », [L] « Garder mon programme » (pas une impasse). */
export function ReponseProposition({ adaptationId }: { adaptationId: string }) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const enLigne = useEnLigne();
  const reponse = useReponseProposition(adaptationId);
  const bloque = reponse.isPending || !enLigne;

  return (
    <View style={styles.bloc}>
      {reponse.isError ? (
        <AppText variant="secondaire" color={colors.alerte} accessibilityRole="alert">
          {texteErreur(reponse.error) ?? t('programme.erreurEnregistrement')}
        </AppText>
      ) : null}
      {enLigne ? null : <AvisHorsLigne />}
      <Button label={t('programme.adaptations.accepter')} variant="secondaire" onPress={() => reponse.mutate('accepter')} disabled={bloque} />
      <Button label={t('programme.adaptations.refuser')} variant="discret" onPress={() => reponse.mutate('refuser')} disabled={bloque} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

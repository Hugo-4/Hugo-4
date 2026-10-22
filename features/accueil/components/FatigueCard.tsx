import { TriangleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Accueil } from '../types';
import { useReponseAdaptation } from '../useReponseAdaptation';

type Props = {
  adaptation: NonNullable<Accueil['adaptation_proposee']>;
};

/** Adaptation proposée par le coach (ex. semaine allégée) : accepter ou garder le programme. */
export function FatigueCard({ adaptation }: Props) {
  const { t } = useTranslation();
  const reponse = useReponseAdaptation();
  const message = adaptation.explication ?? adaptation.raison;

  return (
    <Card borderColor={colors.alerte}>
      <View style={styles.titre}>
        <TriangleAlert color={colors.alerte} size={sizes.icone} />
        <AppText variant="surTitre" color={colors.alerte}>
          {t('accueil.fatigue.titre')}
        </AppText>
      </View>
      {message ? <AppText variant="corps">{message}</AppText> : null}
      {reponse.isError ? <ErreurEnregistrement erreur={reponse.error} /> : null}
      <View style={styles.boutons}>
        <Button
          label={t('accueil.fatigue.alleger')}
          disabled={reponse.isPending}
          onPress={() => reponse.mutate({ id: adaptation.id, choix: 'accepter' })}
        />
        <Button
          label={t('accueil.fatigue.garder')}
          variant="secondaire"
          disabled={reponse.isPending}
          onPress={() => reponse.mutate({ id: adaptation.id, choix: 'refuser' })}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  titre: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  boutons: { gap: spacing.s },
});

import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { AttenteGeneration } from '@/features/inscription/components/AttenteGeneration';
import { useGeneration } from '@/features/inscription/useGeneration';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Fin de l'inscription : essai offert, puis génération du premier programme. */
export default function GenerationScreen() {
  const { t } = useTranslation();
  const { enCours, echec, reessayer } = useGeneration();

  return (
    <Screen>
      <View style={styles.contenu}>
        <Card>
          <View style={styles.essai}>
            <Trophy color={colors.accent} size={sizes.icone + spacing.xs} />
            <AppText variant="corpsGras" style={styles.texte}>
              {t('inscription.generation.essai')}
            </AppText>
          </View>
        </Card>
        <View style={styles.centre}>
          {enCours ? (
            <AttenteGeneration />
          ) : (
            <View style={styles.erreur}>
              <AppText variant="titre">{t('inscription.generation.echecTitre')}</AppText>
              <ErreurEnregistrement erreur={echec} />
              <Button label={t('commun.reessayer')} onPress={reessayer} />
            </View>
          )}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flex: 1, padding: spacing.ecran, gap: spacing.xl },
  essai: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  texte: { flex: 1 },
  centre: { flex: 1, justifyContent: 'center' },
  erreur: { gap: spacing.l },
});

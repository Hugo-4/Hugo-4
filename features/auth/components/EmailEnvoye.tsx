import { MailCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  email: string;
  onConnexion: () => void;
};

export function EmailEnvoye({ email, onConnexion }: Props) {
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={styles.contenu}>
        <MailCheck color={colors.accent} size={sizes.icone * 3} />
        <AppText variant="titre" style={styles.centre}>
          {t('auth.creerCompte.confirmerEmailTitre')}
        </AppText>
        <AppText variant="secondaire" style={styles.centre}>
          {t('auth.creerCompte.confirmerEmailTexte', { email })}
        </AppText>
        <Button label={t('auth.creerCompte.seConnecter')} onPress={onConnexion} style={styles.bouton} />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: spacing.l, padding: spacing.xxl },
  centre: { textAlign: 'center' },
  bouton: { alignSelf: 'stretch' },
});

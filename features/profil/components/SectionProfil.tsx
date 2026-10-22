import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';

type Props = {
  titre: string;
  onModifier?: () => void;
  children: ReactNode;
};

/** Carte de l'écran Profil : titre, bouton « Modifier », contenu. */
export function SectionProfil({ titre, onModifier, children }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.entete}>
        <AppText variant="surTitre">{titre}</AppText>
        {onModifier ? <Button label={t('profil.modifier')} variant="discret" onPress={onModifier} /> : null}
      </View>
      {children}
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
});

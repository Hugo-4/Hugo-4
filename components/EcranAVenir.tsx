import { Hourglass } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, sizes, spacing } from '@/theme/tokens';

import { EmptyState } from './EmptyState';
import { EnTete } from './EnTete';
import { Screen } from './Screen';

/** Squelette d'un écran secondaire pas encore construit (retour + « bientôt disponible »). */
export function EcranAVenir({ titre }: { titre: string }) {
  const { t } = useTranslation();
  return (
    <Screen>
      <EnTete titre={titre} />
      <View style={styles.contenu}>
        <EmptyState
          icon={<Hourglass color={colors.discret} size={sizes.icone * 2} />}
          titre={t('commun.bientotTitre')}
          texte={t('commun.ecranAVenir')}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flex: 1, padding: spacing.ecran },
});

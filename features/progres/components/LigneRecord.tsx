import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Card } from '@/components/Card';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import type { RecordJalon } from '../types';
import { ContenuRecord } from './ContenuRecord';

type Props = {
  record: RecordJalon;
  /** Ouvre l'origine du record (détail du test ou de la séance) ; absent : carte non tactile. */
  onPress: (() => void) | null;
};

/** Un record ou un jalon de la liste (niveau 2) ; toucher la carte ouvre son origine quand elle est connue (niveau 3). */
export function LigneRecord({ record, onPress }: Props) {
  const { t } = useTranslation();
  const carte = (
    <Card>
      <View style={styles.ligne}>
        <View style={styles.contenu}>
          <ContenuRecord record={record} />
        </View>
        {onPress ? <ChevronRight color={colors.discret} size={sizes.icone} /> : null}
      </View>
    </Card>
  );
  if (!onPress) return carte;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={t(record.origine?.type === 'test' ? 'progres.records.ouvrirTest' : 'progres.records.ouvrirSeance')}
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.presse : null)}>
      {carte}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  contenu: { flex: 1 },
  presse: { opacity: opacity.presse },
});

import { Trophy } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { CompteARebours } from '@/components/CompteARebours';
import { formatCompteARebours, formatDateEvenement } from '@/lib/format';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import { joursEntre } from '../dates';
import type { Evenement } from '../types';

type Props = {
  evenement: Evenement;
  aujourdhui: string;
  onPress: () => void;
};

/** Objectif A : nom, compte à rebours lisible et date ; toucher la carte ouvre la compétition. */
export function ObjectifCard({ evenement, aujourdhui, onPress }: Props) {
  const { t } = useTranslation();
  const jours = joursEntre(aujourdhui, evenement.date_evenement);
  const libelle = t('programme.objectif.a11y', {
    nom: evenement.nom,
    compte: formatCompteARebours(jours, evenement.date_evenement, aujourdhui),
    date: formatDateEvenement(evenement.date_evenement),
  });
  return (
    <Pressable accessibilityRole="button" accessibilityLabel={libelle} onPress={onPress} style={({ pressed }) => pressed && styles.presse}>
      <Card>
        <View style={styles.ligne}>
          <Trophy color={colors.accent} size={sizes.icone + spacing.xs} />
          <View style={styles.texte}>
            <AppText variant="surTitre">{t('programme.objectif.surTitre')}</AppText>
            <AppText variant="corpsGras">{evenement.nom}</AppText>
            {evenement.sports ? <AppText variant="libelle">{evenement.sports.nom}</AppText> : null}
          </View>
          <CompteARebours jours={jours} date={evenement.date_evenement} aujourdhui={aujourdhui} />
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  presse: { opacity: opacity.presse },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  texte: { flex: 1, gap: spacing.xxs },
});

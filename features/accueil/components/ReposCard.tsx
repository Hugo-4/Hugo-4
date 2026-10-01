import { Moon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { dateLocale, formatJourLong } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { ProchaineSeance } from '../types';

type Props = {
  prochaineSeance: ProchaineSeance | null;
};

export function ReposCard({ prochaineSeance }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.ligne}>
        <Moon color={colors.accent} size={sizes.icone * 2} />
        <View style={styles.texte}>
          <AppText variant="titre">{t('accueil.seance.repos')}</AppText>
          <AppText variant="secondaire">{t('accueil.seance.reposTexte')}</AppText>
        </View>
      </View>
      {prochaineSeance ? (
        <AppText variant="corpsGras">
          {t('accueil.seance.prochaine', {
            titre: prochaineSeance.titre,
            jour: formatJourLong(dateLocale(prochaineSeance.date)),
          })}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.l },
  texte: { flex: 1, gap: spacing.xs },
});

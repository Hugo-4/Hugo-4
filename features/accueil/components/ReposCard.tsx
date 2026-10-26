import { Moon } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { dateLocale, formatJourLong } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  /** Prochaine séance (demain d'après `GET /accueil`, sinon `GET /programme`). */
  prochaine: { id: string; titre: string; date: string } | null;
  onVoirProchaine: () => void;
};

/**
 * Jour sans séance. L'app n'invente aucun conseil de récupération : l'action de récupération
 * viendra du serveur (champ à ajouter à `GET /accueil`, voir FRONTEND.md §1).
 */
export function ReposCard({ prochaine, onVoirProchaine }: Props) {
  const { t } = useTranslation();
  return (
    <Card>
      <View style={styles.ligne}>
        <Moon color={colors.accent} size={sizes.icone * 2} />
        <View style={styles.texte}>
          <AppText variant="titre">{t('accueil.seance.repos')}</AppText>
          {prochaine ? (
            <AppText variant="secondaire">
              {t('accueil.seance.prochaine', { titre: prochaine.titre, jour: formatJourLong(dateLocale(prochaine.date)) })}
            </AppText>
          ) : null}
        </View>
      </View>
      {prochaine ? <Button label={t('accueil.seance.voirProchaine')} variant="secondaire" onPress={onVoirProchaine} /> : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.l },
  texte: { flex: 1, gap: spacing.xs },
});

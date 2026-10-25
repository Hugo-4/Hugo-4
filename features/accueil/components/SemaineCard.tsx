import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { dateLocale, formatJourLong } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import type { SemaineAVenir } from '../semaineProgramme';
import type { Accueil } from '../types';
import { JourPastille } from './JourPastille';

type Props = {
  semaine: Accueil['semaine'];
  /** Semaine en cours vide parce que le programme n'a pas commencé : on montre sa première semaine. */
  aVenir: SemaineAVenir | null;
  onVoirMois: () => void;
};

export function SemaineCard({ semaine, aVenir, onVoirMois }: Props) {
  const { t } = useTranslation();
  const { stats } = semaine;
  const jours = stats.prevues === 0 && aVenir ? aVenir.jours : semaine.jours;
  const premier = aVenir ? dateLocale(aVenir.premierJour) : null;

  return (
    <Card>
      <View style={styles.entete}>
        <AppText variant="surTitre" style={styles.titre}>
          {stats.prevues === 0 && aVenir && premier
            ? t('accueil.semaine.aVenir', {
                numero: aVenir.numero,
                jour: formatJourLong(premier),
                date: premier.getDate(),
              })
            : t('accueil.semaine.titre')}
        </AppText>
        <Button label={t('accueil.semaine.voirMois')} variant="discret" onPress={onVoirMois} />
      </View>
      <View style={styles.jours}>
        {jours.map((jour) => (
          <JourPastille key={jour.date} jour={jour} />
        ))}
      </View>
      {stats.prevues > 0 ? (
        <AppText variant="secondaire">
          {t('accueil.semaine.stats', { faites: stats.faites, prevues: stats.prevues, minutes: stats.minutes_prevues })}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: spacing.s },
  titre: { flex: 1 },
  jours: { flexDirection: 'row', justifyContent: 'space-between', gap: spacing.xs },
});

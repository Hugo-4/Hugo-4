import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { formatNombre } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import { formatDateJour } from '../format';
import type { Ligue } from '../types';

type Props = {
  ligue: Ligue;
  enCours: boolean;
  onInscription: (rejoindre: boolean) => void;
};

/** Une ligue (au choix) : critère de performance, rang si l'athlète l'a rejointe, échéance, Rejoindre / Quitter. */
export function LigneLigue({ ligue, enCours, onInscription }: Props) {
  const { t } = useTranslation();
  const details = [
    ligue.critere_libelle,
    ligue.inscrit && ligue.rang !== null
      ? t('progres.ligues.rang', { rang: formatNombre(ligue.rang), participants: formatNombre(ligue.participants) })
      : t('progres.ligues.participants', { count: ligue.participants, nombre: formatNombre(ligue.participants) }),
    ligue.fin ? t('progres.ligues.jusquau', { date: formatDateJour(ligue.fin) }) : null,
  ].filter(Boolean);

  return (
    <View style={styles.bloc}>
      <View style={styles.textes} accessible>
        <AppText variant="corpsGras">{ligue.nom}</AppText>
        <AppText variant="libelle">{details.join(' · ')}</AppText>
      </View>
      <Button
        label={t(ligue.inscrit ? 'progres.ligues.quitter' : 'progres.ligues.rejoindre')}
        variant="secondaire"
        onPress={() => onInscription(!ligue.inscrit)}
        disabled={enCours}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  textes: { gap: spacing.xxs },
});

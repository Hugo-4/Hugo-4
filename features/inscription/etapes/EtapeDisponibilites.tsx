import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { spacing } from '@/theme/tokens';

import { GroupeChoix } from '../components/GroupeChoix';
import { CRENEAUX, DUREES_MIN, JOURS } from '../constantes';
import { useInscription } from '../InscriptionProvider';

export function EtapeDisponibilites() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const { jours } = reponses;

  const basculerJour = (jour: number) =>
    modifier({ jours: jours.includes(jour) ? jours.filter((j) => j !== jour) : [...jours, jour].sort() });

  return (
    <View style={styles.bloc}>
      <GroupeChoix titre={t('inscription.dispos.jours')} aide={t('inscription.dispos.joursAide')}>
        {JOURS.map((jour) => (
          <Chip
            key={jour}
            label={t(`inscription.dispos.joursCourts.${jour}`)}
            accessibilityLabel={t(`inscription.dispos.joursLongs.${jour}`)}
            selectionne={jours.includes(jour)}
            onPress={() => basculerJour(jour)}
          />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.dispos.creneau')} radio>
        {CRENEAUX.map((creneau) => (
          <Chip
            key={creneau}
            role="radio"
            label={t(`inscription.dispos.creneaux.${creneau}`)}
            selectionne={reponses.creneau === creneau}
            onPress={() => modifier({ creneau })}
          />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.dispos.duree')} radio>
        {DUREES_MIN.map((duree) => (
          <Chip
            key={duree}
            role="radio"
            label={t('inscription.dispos.minutes', { minutes: duree })}
            selectionne={reponses.dureeMin === duree}
            onPress={() => modifier({ dureeMin: duree })}
          />
        ))}
      </GroupeChoix>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xxl },
});

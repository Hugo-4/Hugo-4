import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';

import { ChoixCadre } from '../components/ChoixCadre';
import { useInscription } from '../InscriptionProvider';
import { libelleReferentiel } from '../libelles';
import { useSports } from '../useReferentiels';

/** Cadre de pratique de chaque sport choisi (loisir / amateur / pro). */
export function EtapeCadre() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const sports = useSports();
  const ids = [reponses.sportId, ...reponses.sportsSecondaires].filter((id): id is string => id !== null);

  return (
    <View style={styles.bloc}>
      <AppText variant="libelle">{t('inscription.cadre.aide')}</AppText>
      {ids.map((id) => {
        const sport = sports.data?.find((s) => s.id === id);
        return (
          <ChoixCadre
            key={id}
            titre={sport ? libelleReferentiel('sports', sport) : ''}
            valeur={reponses.cadres[id]}
            onChange={(cadre) => modifier({ cadres: { ...reponses.cadres, [id]: cadre } })}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xl },
});

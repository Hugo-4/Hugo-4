import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { formatNombre } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import { GroupeChoix } from '../components/GroupeChoix';
import { ENCADREMENTS, IMPACTS, LIEUX_POSSIBLES, MINUTES_SEMAINE } from '../constantes';
import { useInscription } from '../InscriptionProvider';
import type { Reponses } from '../types';

/** Parcours B, étape 2 : articulations, lieux possibles, seul ou en club, temps par semaine. */
export function EtapeContraintes() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const c = reponses.contraintes;
  // Toute modification invalide la recommandation déjà choisie.
  const changer = (changement: Partial<Reponses['contraintes']>) =>
    modifier({ contraintes: { ...c, ...changement }, sportId: null });

  return (
    <View style={styles.bloc}>
      <GroupeChoix titre={t('inscription.contraintes.impact')} aide={t('inscription.contraintes.impactAide')} radio>
        {IMPACTS.map((impact) => (
          <Chip
            key={impact}
            role="radio"
            label={t(`inscription.contraintes.impacts.${impact}`)}
            selectionne={c.impactMax === impact}
            onPress={() => changer({ impactMax: impact })}
          />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.contraintes.lieux')} aide={t('inscription.contraintes.plusieurs')}>
        {LIEUX_POSSIBLES.map((lieu) => (
          <Chip
            key={lieu}
            label={t(`inscription.contraintes.lieuxPossibles.${lieu}`)}
            selectionne={c.lieux.includes(lieu)}
            onPress={() => changer({ lieux: c.lieux.includes(lieu) ? c.lieux.filter((l) => l !== lieu) : [...c.lieux, lieu] })}
          />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.contraintes.encadrement')} radio>
        {ENCADREMENTS.map((e) => (
          <Chip
            key={e}
            role="radio"
            label={t(`inscription.contraintes.encadrements.${e}`)}
            selectionne={c.encadrement === e}
            onPress={() => changer({ encadrement: e })}
          />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.contraintes.temps')} radio>
        {MINUTES_SEMAINE.map((minutes) => (
          <Chip
            key={minutes}
            role="radio"
            label={t('inscription.contraintes.heures', { heures: formatNombre(minutes / 60, minutes % 60 ? 1 : 0) })}
            selectionne={c.minutesSemaine === minutes}
            onPress={() => changer({ minutesSemaine: minutes })}
          />
        ))}
      </GroupeChoix>
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xxl },
});

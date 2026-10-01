import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { DateField } from '@/components/DateField';
import { TextField } from '@/components/TextField';
import { spacing } from '@/theme/tokens';

import { GroupeChoix } from '../components/GroupeChoix';
import { TYPES_EVENEMENT } from '../constantes';
import { dateIso, estDansLeFutur } from '../dates';
import { useInscription } from '../InscriptionProvider';
import type { Reponses } from '../types';

/** Compétition visée (parcours Complet) : le programme se construit autour d'elle. */
export function EtapeCompetition() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const { competition } = reponses;
  const changer = (changement: Partial<Reponses['competition']>) =>
    modifier({ competition: { ...competition, ...changement } });

  const iso = dateIso(competition.date);
  const dateSaisie = competition.date.annee.length === 4;
  const erreurDate = dateSaisie && (!iso || !estDansLeFutur(iso)) ? t('inscription.erreurs.dateFuture') : undefined;

  return (
    <View style={styles.bloc}>
      <GroupeChoix titre={t('inscription.competition.question')} radio>
        <Chip role="radio" label={t('commun.oui')} selectionne={competition.prevue === true} onPress={() => changer({ prevue: true })} />
        <Chip role="radio" label={t('commun.non')} selectionne={competition.prevue === false} onPress={() => changer({ prevue: false })} />
      </GroupeChoix>
      {competition.prevue ? (
        <>
          <TextField
            label={t('inscription.competition.nom')}
            value={competition.nom}
            onChangeText={(nom) => changer({ nom })}
          />
          <DateField
            label={t('inscription.competition.date')}
            valeur={competition.date}
            onChange={(date) => changer({ date })}
            erreur={erreurDate}
          />
          <GroupeChoix titre={t('inscription.competition.type')} radio>
            {TYPES_EVENEMENT.map((type) => (
              <Chip
                key={type}
                role="radio"
                label={t(`inscription.competition.types.${type}`)}
                selectionne={competition.type === type}
                onPress={() => changer({ type })}
              />
            ))}
          </GroupeChoix>
        </>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xl },
});

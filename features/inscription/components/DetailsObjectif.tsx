import { View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { DateField } from '@/components/DateField';
import { TextField } from '@/components/TextField';
import { spacing } from '@/theme/tokens';

import { dateIso, estDansLeFutur } from '../dates';
import { useInscription } from '../InscriptionProvider';
import type { ObjectifChoisi } from '../types';

/** Échéance (date + épreuve) et précision (distance, catégorie de poids, poste) si l'objectif les demande. */
export function DetailsObjectif({ objectif }: { objectif: ObjectifChoisi }) {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const { echeance } = reponses;
  const changer = (changement: Partial<typeof echeance>) => modifier({ echeance: { ...echeance, ...changement } });
  const iso = dateIso(echeance.date);
  const erreurDate =
    echeance.date.annee.length === 4 && (!iso || !estDansLeFutur(iso)) ? t('inscription.erreurs.dateFuture') : undefined;

  return (
    <View style={{ gap: spacing.l }}>
      {objectif.echeanceRequise ? (
        <>
          <TextField
            label={t('inscription.echeance.epreuve')}
            value={echeance.epreuve}
            onChangeText={(epreuve) => changer({ epreuve })}
          />
          <DateField
            label={t('inscription.echeance.date')}
            valeur={echeance.date}
            onChange={(date) => changer({ date })}
            erreur={erreurDate}
          />
        </>
      ) : null}
      {objectif.precisionDemandee ? (
        <TextField
          label={t(`inscription.echeance.precision.${objectif.precisionDemandee}`)}
          aide={t(`inscription.echeance.precisionAide.${objectif.precisionDemandee}`)}
          value={echeance.precision}
          onChangeText={(precision) => changer({ precision })}
          keyboardType={objectif.precisionDemandee === 'categorie_poids' ? 'decimal-pad' : 'default'}
        />
      ) : null}
    </View>
  );
}

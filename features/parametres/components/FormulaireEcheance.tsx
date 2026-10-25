import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { DateField } from '@/components/DateField';
import { TextField } from '@/components/TextField';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { dateIso, estDansLeFutur } from '@/features/inscription/dates';
import { colors, spacing } from '@/theme/tokens';

import { echeanceDepuis, saisieDepuis } from '../echeance';
import type { Evenement } from '../types';
import { type ObjectifPrincipal, useModifierEcheance } from '../useObjectifPrincipal';

type Props = {
  objectif: ObjectifPrincipal;
  /** Compétitions déjà chargées : sans elles, impossible de savoir s'il faut créer la compétition A. */
  evenements: Evenement[] | undefined;
};

/** Échéance de l'objectif principal : épreuve et date, précision (distance, catégorie de poids, poste). */
export function FormulaireEcheance({ objectif, evenements }: Props) {
  const { t } = useTranslation();
  const [saisie, setSaisie] = useState(() => saisieDepuis(objectif));
  const [modifie, setModifie] = useState(false);
  const modification = useModifierEcheance();
  const o = objectif.objectifs_sport;
  const echeance = echeanceDepuis(objectif, saisie);
  const iso = dateIso(saisie.date);
  const erreurDate =
    saisie.date.annee.length === 4 && (!iso || !estDansLeFutur(iso)) ? t('inscription.erreurs.dateFuture') : undefined;
  const changer = (changement: Partial<typeof saisie>) => {
    setSaisie((s) => ({ ...s, ...changement }));
    setModifie(true);
    modification.reset();
  };

  return (
    <View style={styles.bloc}>
      {o?.echeance_requise ? (
        <>
          <TextField
            label={t('inscription.echeance.epreuve')}
            value={saisie.epreuve}
            onChangeText={(epreuve) => changer({ epreuve })}
          />
          <DateField
            label={t('inscription.echeance.date')}
            valeur={saisie.date}
            onChange={(date) => changer({ date })}
            erreur={erreurDate}
          />
          <AppText variant="libelle">{t('parametres.objectifs.aideEcheance')}</AppText>
        </>
      ) : null}
      {o?.precision_demandee ? (
        <TextField
          label={t(`inscription.echeance.precision.${o.precision_demandee}`)}
          aide={t(`inscription.echeance.precisionAide.${o.precision_demandee}`)}
          value={saisie.precision}
          onChangeText={(precision) => changer({ precision })}
          keyboardType={o.precision_demandee === 'categorie_poids' ? 'decimal-pad' : 'default'}
        />
      ) : null}
      {modification.isError ? <ErreurEnregistrement erreur={modification.error} /> : null}
      {modification.isSuccess && !modifie ? (
        <AppText variant="corpsGras" color={colors.accent} accessibilityLiveRegion="polite">
          {t('parametres.objectifs.echeanceEnregistree')}
        </AppText>
      ) : null}
      <Button
        label={t('parametres.objectifs.enregistrerEcheance')}
        disabled={!modifie || !echeance || !evenements || modification.isPending}
        onPress={() =>
          echeance &&
          evenements &&
          modification.mutate({ objectif, echeance, evenements }, { onSuccess: () => setModifie(false) })
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
});

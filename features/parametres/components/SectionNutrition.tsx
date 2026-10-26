import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Interrupteur } from '@/components/Interrupteur';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { useAffichageCalories, useModifierAffichageCalories } from '@/features/nutrition/useAffichageCalories';
import { SectionProfil } from '@/features/profil/components/SectionProfil';

import { ALLERGIES, REGIMES, REPAS_PAR_JOUR } from '../constantes';
import { PARAMETRES_FICTIF } from '../source';
import { useModifierNutrition, useNutrition } from '../useNutrition';
import { EtatSection } from './EtatSection';

/**
 * Nutrition : afficher les calories (`preferences_entrainement.afficher_calories`), alimentation, repas par jour,
 * allergies (données de santé, seulement avec consentement).
 */
export function SectionNutrition() {
  const { t } = useTranslation();
  const { requete, donnees, avecSante } = useNutrition();
  const modification = useModifierNutrition();
  const allergies = donnees?.allergies ?? [];
  const calories = useAffichageCalories();
  const modifierCalories = useModifierAffichageCalories();

  return (
    <SectionProfil titre={t('parametres.preferences.nutrition')}>
      {calories.requete.data ? (
        <Interrupteur
          libelle={t('parametres.preferences.afficherCalories')}
          aide={t('parametres.preferences.afficherCaloriesAide')}
          valeur={calories.afficher}
          onChange={(v) => modifierCalories.mutate(v)}
          desactive={modifierCalories.isPending}
        />
      ) : null}
      {modifierCalories.isError ? <ErreurEnregistrement erreur={modifierCalories.error} /> : null}
      {PARAMETRES_FICTIF ? <Bandeau texte={t('parametres.fictif')} /> : null}
      <EtatSection
        chargement={requete.isPending}
        erreur={requete.error}
        aDesDonnees={donnees !== undefined}
        onReessayer={requete.refetch}>
        <GroupeChoix titre={t('parametres.preferences.regime')} radio>
          {REGIMES.map((regime) => (
            <Chip
              key={regime}
              role="radio"
              label={t(`parametres.preferences.regimes.${regime}`)}
              selectionne={donnees?.regime === regime}
              onPress={() => modification.mutate({ regime })}
            />
          ))}
        </GroupeChoix>
        <GroupeChoix titre={t('parametres.preferences.repas')} radio>
          {REPAS_PAR_JOUR.map((repas) => (
            <Chip
              key={repas}
              role="radio"
              label={String(repas)}
              selectionne={donnees?.repas_par_jour === repas}
              onPress={() => modification.mutate({ repas_par_jour: repas })}
            />
          ))}
        </GroupeChoix>
        {avecSante ? (
          <GroupeChoix titre={t('parametres.preferences.allergies')} aide={t('parametres.preferences.allergiesAide')}>
            {ALLERGIES.map((allergie) => (
              <Chip
                key={allergie}
                label={t(`parametres.preferences.listeAllergies.${allergie}`)}
                selectionne={allergies.includes(allergie)}
                onPress={() =>
                  modification.mutate({
                    allergies: allergies.includes(allergie)
                      ? allergies.filter((a) => a !== allergie)
                      : [...allergies, allergie],
                  })
                }
              />
            ))}
          </GroupeChoix>
        ) : (
          <>
            <AppText variant="secondaire">{t('parametres.preferences.allergiesSansAccord')}</AppText>
            <Button
              label={t('parametres.sante.voirConsentements')}
              variant="discret"
              onPress={() => router.push('/compte/consentements')}
            />
          </>
        )}
        {modification.isError ? <ErreurEnregistrement erreur={modification.error} /> : null}
      </EtatSection>
    </SectionProfil>
  );
}

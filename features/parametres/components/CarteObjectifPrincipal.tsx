import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { libelleReferentiel, texteLocal } from '@/features/inscription/libelles';
import { SectionProfil } from '@/features/profil/components/SectionProfil';

import { aUneEcheance } from '../echeance';
import type { Evenement } from '../types';
import type { ObjectifPrincipal } from '../useObjectifPrincipal';
import { FormulaireEcheance } from './FormulaireEcheance';

type Props = {
  objectif: ObjectifPrincipal | null;
  evenements: Evenement[] | undefined;
};

/** Sport principal, objectif précis et son échéance (modifiable). */
export function CarteObjectifPrincipal({ objectif, evenements }: Props) {
  const { t } = useTranslation();
  if (!objectif) {
    return (
      <SectionProfil titre={t('parametres.objectifs.principal')}>
        <AppText variant="secondaire">{t('parametres.objectifs.aucunObjectif')}</AppText>
      </SectionProfil>
    );
  }
  const sport = objectif.sports ? libelleReferentiel('sports', objectif.sports) : null;
  const libelle = objectif.objectifs_sport
    ? texteLocal({ fr: objectif.objectifs_sport.libelle_fr, en: objectif.objectifs_sport.libelle_en })
    : t('profil.nonRenseigne');

  return (
    <SectionProfil
      titre={t('parametres.objectifs.principal')}
      onModifier={() => router.push({ pathname: '/compte/sport/[id]', params: { id: objectif.id } })}>
      {sport ? <AppText variant="libelle">{sport}</AppText> : null}
      <AppText variant="corpsGras">{libelle}</AppText>
      {aUneEcheance(objectif) ? (
        <FormulaireEcheance objectif={objectif} evenements={evenements} />
      ) : (
        <AppText variant="secondaire">{t('parametres.objectifs.sansEcheance')}</AppText>
      )}
    </SectionProfil>
  );
}

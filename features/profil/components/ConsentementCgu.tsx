import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { formatHorodatage } from '@/lib/format';

import type { EtatConsentement } from '../types';
import { useChangerConsentement } from '../useModifierProfil';
import { LigneInfo } from './LigneInfo';
import { SectionProfil } from './SectionProfil';

/** Conditions d'utilisation : date d'acceptation ; si elles n'ont jamais été acceptées, bouton pour le faire. */
export function ConsentementCgu({ etat }: { etat: EtatConsentement | undefined }) {
  const { t } = useTranslation();
  const changement = useChangerConsentement();
  const accorde = etat?.accorde === true;

  return (
    <SectionProfil titre={t('profil.consentements.cgu')}>
      <LigneInfo
        libelle={t('profil.consentements.statut')}
        valeur={
          accorde && etat
            ? t('profil.consentements.accordeLe', { horodatage: formatHorodatage(etat.le) })
            : t('profil.consentements.jamais')
        }
      />
      {accorde ? (
        <AppText variant="libelle">{t('profil.consentements.cguRetrait')}</AppText>
      ) : (
        <>
          <AppText variant="secondaire">{t('inscription.consentements.cguTexte')}</AppText>
          {changement.isError ? <ErreurEnregistrement erreur={changement.error} /> : null}
          <Button
            label={t('inscription.consentements.cgu')}
            disabled={changement.isPending}
            onPress={() => changement.mutate({ type: 'cgu', accorde: true })}
          />
        </>
      )}
    </SectionProfil>
  );
}

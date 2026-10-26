import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { formatHorodatage } from '@/lib/format';
import { colors } from '@/theme/tokens';

import type { EtatConsentement } from '../types';
import { useChangerConsentement } from '../useModifierProfil';
import { SectionProfil } from './SectionProfil';

type Props = {
  etat: EtatConsentement | undefined;
  /** Les CGU manquent aussi : leur acceptation est l'action principale, « Donner mon accord » passe en secondaire. */
  cguManquantes?: boolean;
};

/** Consentement « données de santé » : l'athlète peut l'accorder ou le retirer à tout moment. */
export function ConsentementSante({ etat, cguManquantes = false }: Props) {
  const { t } = useTranslation();
  const changement = useChangerConsentement();
  const accorde = etat?.accorde === true;

  return (
    <SectionProfil titre={t('profil.consentements.sante')}>
      <AppText variant="corps">{t('inscription.consentements.santeTexte')}</AppText>
      <AppText variant="corpsGras" color={accorde ? colors.accent : colors.discret}>
        {etat
          ? t(accorde ? 'profil.consentements.accordeLe' : 'profil.consentements.retireLe', {
              horodatage: formatHorodatage(etat.le),
            })
          : t('profil.consentements.jamais')}
      </AppText>
      {accorde ? <AppText variant="libelle">{t('profil.consentements.effetRetrait')}</AppText> : null}
      {changement.isError ? <ErreurEnregistrement erreur={changement.error} /> : null}
      <Button
        label={t(accorde ? 'profil.consentements.retirer' : 'profil.consentements.accorder')}
        variant={accorde || cguManquantes ? 'secondaire' : 'principal'}
        disabled={changement.isPending}
        onPress={() => changement.mutate({ type: 'donnees_sante', accorde: !accorde })}
      />
    </SectionProfil>
  );
}

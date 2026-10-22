import { useTranslation } from 'react-i18next';

import { formatHorodatage } from '@/lib/format';
import { colors } from '@/theme/tokens';

import type { EtatConsentement, TypeConsentement } from '../types';
import { LigneInfo } from './LigneInfo';
import { SectionProfil } from './SectionProfil';

type Props = {
  consentements: Partial<Record<TypeConsentement, EtatConsentement>>;
  onGerer: () => void;
};

export function CarteConsentements({ consentements, onGerer }: Props) {
  const { t } = useTranslation();
  const etat = (type: TypeConsentement) => {
    const c = consentements[type];
    if (!c) return { valeur: t('profil.consentements.jamais'), couleur: colors.discret };
    return {
      valeur: t(c.accorde ? 'profil.consentements.accordeLe' : 'profil.consentements.retireLe', {
        horodatage: formatHorodatage(c.le),
      }),
      couleur: c.accorde ? colors.accent : colors.discret,
    };
  };
  return (
    <SectionProfil titre={t('profil.consentements.titre')} onModifier={onGerer}>
      <LigneInfo libelle={t('profil.consentements.cgu')} {...etat('cgu')} />
      <LigneInfo libelle={t('profil.consentements.sante')} {...etat('donnees_sante')} />
    </SectionProfil>
  );
}

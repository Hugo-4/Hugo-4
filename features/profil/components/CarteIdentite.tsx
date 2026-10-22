import { useTranslation } from 'react-i18next';

import { formatDateCourte } from '@/lib/format';

import type { Identite } from '../types';
import { LigneInfo } from './LigneInfo';
import { SectionProfil } from './SectionProfil';

export function CarteIdentite({ identite, onModifier }: { identite: Identite; onModifier: () => void }) {
  const { t } = useTranslation();
  const vide = t('profil.nonRenseigne');
  return (
    <SectionProfil titre={t('profil.identite.titre')} onModifier={onModifier}>
      <LigneInfo libelle={t('inscription.identite.prenom')} valeur={identite.prenom ?? vide} />
      <LigneInfo
        libelle={t('inscription.identite.naissance')}
        valeur={identite.dateNaissance ? formatDateCourte(identite.dateNaissance) : vide}
      />
      <LigneInfo
        libelle={t('profil.identite.pays')}
        valeur={identite.pays ? String(t(`pays.${identite.pays}` as never, { defaultValue: identite.pays })) : vide}
      />
    </SectionProfil>
  );
}

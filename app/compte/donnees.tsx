import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { Button } from '@/components/Button';
import { Bandeau } from '@/components/Bandeau';
import { CarteExport } from '@/features/parametres/components/CarteExport';
import { FeuilleSuppression } from '@/features/parametres/components/FeuilleSuppression';
import { PARAMETRES_FICTIF } from '@/features/parametres/source';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { SectionProfil } from '@/features/profil/components/SectionProfil';

/** Profil : exporter mes données, supprimer mon compte (double confirmation ; seul élément rouge de l'écran). */
export default function DonneesScreen() {
  const { t } = useTranslation();
  const [suppression, setSuppression] = useState(false);

  return (
    <EcranEdition titre={t('parametres.donnees.titre')}>
      <BandeauHorsLigne />
      {PARAMETRES_FICTIF ? <Bandeau texte={t('parametres.fictif')} /> : null}
      <CarteExport />
      <SectionProfil titre={t('parametres.donnees.suppression')}>
        <AppText variant="secondaire">{t('parametres.donnees.suppressionTexte')}</AppText>
        <Button label={t('parametres.donnees.supprimer')} variant="danger" onPress={() => setSuppression(true)} />
      </SectionProfil>
      {suppression ? <FeuilleSuppression onFermer={() => setSuppression(false)} /> : null}
    </EcranEdition>
  );
}

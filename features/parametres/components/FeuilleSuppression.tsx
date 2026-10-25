import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { Feuille } from '@/components/Feuille';
import { MessageErreur } from '@/features/auth/components/MessageErreur';

import { PARAMETRES_FICTIF } from '../source';
import { useSupprimerCompte } from '../useDonnees';

/**
 * Double confirmation avant la suppression du compte : 1) ce qui est effacé (et ce qui ne l'est pas),
 * 2) dernière confirmation, seul bouton rouge. Puis suppression et déconnexion.
 */
export function FeuilleSuppression({ onFermer }: { onFermer: () => void }) {
  const { t } = useTranslation();
  const [etape, setEtape] = useState<1 | 2>(1);
  const suppression = useSupprimerCompte();

  return (
    <Feuille
      visible
      titre={t(etape === 1 ? 'parametres.donnees.etape1Titre' : 'parametres.donnees.etape2Titre')}
      onFermer={onFermer}>
      {PARAMETRES_FICTIF ? <Bandeau texte={t('parametres.donnees.fictif')} /> : null}
      {etape === 1 ? (
        <>
          <AppText variant="corps">{t('parametres.donnees.etape1Liste')}</AppText>
          <AppText variant="secondaire">{t('parametres.donnees.etape1Abonnement')}</AppText>
          <AppText variant="secondaire">{t('parametres.donnees.etape1Export')}</AppText>
          <Button label={t('parametres.donnees.garder')} onPress={onFermer} />
          <Button label={t('parametres.donnees.continuer')} variant="secondaire" onPress={() => setEtape(2)} />
        </>
      ) : (
        <>
          <AppText variant="corps">{t('parametres.donnees.etape2Texte')}</AppText>
          {suppression.isError ? <MessageErreur texte={t('parametres.donnees.erreurSuppression')} /> : null}
          <Button
            label={t('parametres.donnees.supprimerDefinitivement')}
            variant="danger"
            disabled={suppression.isPending}
            onPress={() => suppression.mutate()}
          />
          <Button
            label={t('parametres.donnees.garder')}
            variant="secondaire"
            disabled={suppression.isPending}
            onPress={onFermer}
          />
        </>
      )}
    </Feuille>
  );
}

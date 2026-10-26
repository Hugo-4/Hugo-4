import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { Feuille } from '@/components/Feuille';
import { MessageErreur } from '@/features/auth/components/MessageErreur';

import { PARAMETRES_FICTIF } from '../source';
import { issueEchecSuppression, useSupprimerCompte, useTerminerDeconnexion } from '../useDonnees';

const MESSAGES = {
  refusee: 'parametres.donnees.erreurSuppression',
  incertaine: 'parametres.donnees.erreurSuppressionIncertaine',
  supprime: 'parametres.donnees.supprimeSansDeconnexion',
} as const;

/**
 * Double confirmation avant la suppression du compte : 1) ce qui est effacé (et ce qui ne l'est pas),
 * 2) dernière confirmation, seul bouton rouge. Puis suppression et déconnexion.
 * « Ton compte est intact » n'est affiché que si le serveur a répondu par une erreur ; si le compte est
 * supprimé mais la déconnexion échoue, seul « Me déconnecter » reste proposé.
 */
export function FeuilleSuppression({ onFermer }: { onFermer: () => void }) {
  const { t } = useTranslation();
  const [etape, setEtape] = useState<1 | 2>(1);
  const suppression = useSupprimerCompte();
  const deconnexion = useTerminerDeconnexion();
  const issue = suppression.isError ? issueEchecSuppression(suppression.error) : null;
  const occupe = suppression.isPending || deconnexion.isPending;

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
      ) : issue === 'supprime' ? (
        <>
          <MessageErreur texte={t(MESSAGES.supprime)} />
          <Button
            label={t('parametres.donnees.seDeconnecter')}
            disabled={occupe}
            onPress={() => deconnexion.mutate()}
          />
        </>
      ) : (
        <>
          <AppText variant="corps">{t('parametres.donnees.etape2Texte')}</AppText>
          {issue ? <MessageErreur texte={t(MESSAGES[issue])} /> : null}
          <Button
            label={t('parametres.donnees.supprimerDefinitivement')}
            variant="danger"
            disabled={occupe}
            onPress={() => suppression.mutate()}
          />
          <Button label={t('parametres.donnees.garder')} variant="secondaire" disabled={occupe} onPress={onFermer} />
        </>
      )}
    </Feuille>
  );
}

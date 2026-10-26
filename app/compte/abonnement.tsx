import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { EtatsEcran } from '@/components/EtatsEcran';
import { LigneListe } from '@/components/LigneListe';
import { Skeleton } from '@/components/Skeleton';
import { CarteCredits } from '@/features/parametres/components/CarteCredits';
import { EtatSection } from '@/features/parametres/components/EtatSection';
import { PARAMETRES_FICTIF } from '@/features/parametres/source';
import { useCredits, useOffre } from '@/features/parametres/useAbonnement';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import { radius, sizes } from '@/theme/tokens';

/** Profil : offre actuelle et crédits du mois, en lecture seule (aucun achat pour l'instant). */
export default function AbonnementScreen() {
  const { t } = useTranslation();
  const offre = useOffre();
  const credits = useCredits(offre.data);

  return (
    <EcranEdition
      titre={t('parametres.abonnement.titre')}
      rafraichir={{
        actif: offre.isRefetching || credits.isRefetching,
        onRafraichir: () => {
          offre.refetch();
          credits.refetch();
        },
      }}>
      <EtatsEcran
        chargement={offre.isPending}
        erreur={offre.error}
        aDesDonnees={offre.data !== undefined}
        onReessayer={offre.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme} arrondi={radius.carte} />}>
        <SectionProfil titre={t('parametres.abonnement.offreActuelle')}>
          <AppText variant="titre">{offre.data ? t(`parametres.abonnement.offres.${offre.data}`) : ''}</AppText>
          <LigneListe
            titre={t('parametres.abonnement.changerOffre')}
            sousTitre={t('parametres.bientot')}
          />
          <AppText variant="libelle">{t('parametres.abonnement.achatsBientot')}</AppText>
        </SectionProfil>
        {PARAMETRES_FICTIF ? <Bandeau texte={t('parametres.fictif')} /> : null}
        <EtatSection
          chargement={credits.isPending}
          erreur={credits.error}
          aDesDonnees={credits.data !== undefined}
          onReessayer={credits.refetch}
          lignes={3}>
          {credits.data ? <CarteCredits credits={credits.data} /> : null}
        </EtatSection>
      </EtatsEcran>
    </EcranEdition>
  );
}

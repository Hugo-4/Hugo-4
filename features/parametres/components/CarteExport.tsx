import { Linking } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import { formatHorodatage } from '@/lib/format';

import { useDemanderExport, useExport } from '../useDonnees';
import { EtatSection } from './EtatSection';

/** Export de toutes mes données (RGPD) : demande, préparation, téléchargement. */
export function CarteExport() {
  const { t } = useTranslation();
  const dernier = useExport();
  const demande = useDemanderExport();
  const e = dernier.data;
  const bouton = (libelle: string) => (
    <Button label={libelle} variant="secondaire" disabled={demande.isPending} onPress={() => demande.mutate()} />
  );

  return (
    <SectionProfil titre={t('parametres.donnees.export')}>
      <AppText variant="secondaire">{t('parametres.donnees.exportTexte')}</AppText>
      <EtatSection
        chargement={dernier.isPending}
        erreur={dernier.error}
        aDesDonnees={dernier.data !== undefined}
        onReessayer={dernier.refetch}
        lignes={1}>
        {!e ? bouton(t('parametres.donnees.exporter')) : null}
        {e?.statut === 'en_preparation' ? (
          <AppText variant="corps" accessibilityLiveRegion="polite">
            {t('parametres.donnees.enPreparation', { date: formatHorodatage(e.demande_le) })}
          </AppText>
        ) : null}
        {e?.statut === 'pret' && e.url ? (
          <>
            <AppText variant="corps">
              {t('parametres.donnees.pret', { date: e.expire_le ? formatHorodatage(e.expire_le) : '' })}
            </AppText>
            <Button
              label={t('parametres.donnees.telecharger')}
              variant="secondaire"
              onPress={() => e.url && Linking.openURL(e.url)}
            />
          </>
        ) : null}
        {e?.statut === 'expire' || e?.statut === 'echec' || (e?.statut === 'pret' && !e.url) ? (
          <>
            <AppText variant="corps">
              {t(e.statut === 'echec' ? 'parametres.donnees.echec' : 'parametres.donnees.expire')}
            </AppText>
            {bouton(t('parametres.donnees.refaire'))}
          </>
        ) : null}
      </EtatSection>
      {demande.isError ? <ErreurEnregistrement erreur={demande.error} /> : null}
    </SectionProfil>
  );
}

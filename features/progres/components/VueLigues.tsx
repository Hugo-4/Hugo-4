import { Users } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { EmptyState } from '@/components/EmptyState';
import { EnTete } from '@/components/EnTete';
import { Screen } from '@/components/Screen';
import { colors, sizes, spacing } from '@/theme/tokens';

import { PROGRES_FICTIF } from '../source';
import { useClassementPublic } from '../useClassementPublic';
import { useInscriptionLigue, useLigues } from '../useDonneesProgres';
import { BadgeExemple } from './BadgeExemple';
import { CadreVue } from './CadreVue';
import { LigneDefi } from './LigneDefi';
import { LigneLigue } from './LigneLigue';
import { ProgresSkeleton } from './ProgresSkeleton';

/**
 * Ligues et défis (niveau 2). Avant 15 ans (ou âge inconnu) : rien de public, la requête n'est pas lancée.
 * Jamais de classement sur le poids ni sur le volume d'entraînement.
 */
export function VueLigues() {
  const { t } = useTranslation();
  const { autorise, enAttente } = useClassementPublic();
  const ligues = useLigues(autorise);
  const inscription = useInscriptionLigue();
  const donnees = ligues.data;
  const icone = <Users color={colors.discret} size={sizes.icone * 2} />;

  if (!autorise) {
    return (
      <Screen>
        <EnTete titre={t('progres.vues.ligues')} />
        <View style={styles.indisponible}>
          {enAttente ? (
            <ProgresSkeleton blocs={2} />
          ) : (
            <EmptyState icon={icone} titre={t('progres.ligues.indisponibleTitre')} texte={t('progres.ligues.indisponibleTexte')} />
          )}
        </View>
      </Screen>
    );
  }

  return (
    <CadreVue
      titre={t('progres.vues.ligues')}
      requete={ligues}
      vide={donnees !== undefined && donnees.ligues.length === 0 && donnees.defis.length === 0}
      etatVide={{ icon: icone, titre: t('progres.ligues.videTitre'), texte: t('progres.ligues.videTexte') }}>
      {donnees ? (
        <>
          {PROGRES_FICTIF ? <BadgeExemple style={styles.exemple} /> : null}
          <AppText variant="secondaire">{t('progres.ligues.regle')}</AppText>
          {donnees.ligues.length ? (
            <Card>
              <AppText variant="surTitre">{t('progres.ligues.liguesTitre')}</AppText>
              <AppText variant="libelle">{t('progres.ligues.choix')}</AppText>
              {donnees.ligues.map((ligue) => (
                <LigneLigue
                  key={ligue.id}
                  ligue={ligue}
                  enCours={inscription.isPending}
                  onInscription={(rejoindre) => inscription.mutate({ id: ligue.id, rejoindre })}
                />
              ))}
            </Card>
          ) : null}
          {donnees.defis.length ? (
            <Card>
              <AppText variant="surTitre">{t('progres.ligues.defisTitre')}</AppText>
              {donnees.defis.map((defi) => (
                <LigneDefi key={defi.id} defi={defi} avecDescription />
              ))}
            </Card>
          ) : null}
        </>
      ) : null}
    </CadreVue>
  );
}

const styles = StyleSheet.create({
  indisponible: { flex: 1, padding: spacing.ecran },
  exemple: { alignSelf: 'flex-start' },
});

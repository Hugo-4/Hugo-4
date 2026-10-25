import { Target } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors, sizes } from '@/theme/tokens';

import { ouvrirVue } from '../navigation';
import { PROGRES_FICTIF } from '../source';
import { useNiveaux } from '../useDonneesProgres';
import { BadgeExemple } from './BadgeExemple';
import { CadreVue } from './CadreVue';
import { CarteNiveauDetail } from './CarteNiveauDetail';
import { QualitesATester } from './QualitesATester';

/** Niveaux (niveau 2) : percentile par qualité, groupe de comparaison toujours affiché, qualités à tester. */
export function VueNiveaux() {
  const { t } = useTranslation();
  const niveaux = useNiveaux();
  const donnees = niveaux.data;
  const vide = donnees !== undefined && donnees.qualites.length === 0 && donnees.manquantes.length === 0;

  return (
    <CadreVue
      titre={t('progres.vues.niveaux')}
      requete={niveaux}
      vide={vide}
      etatVide={{
        icon: <Target color={colors.discret} size={sizes.icone * 2} />,
        titre: t('progres.niveaux.videTitre'),
        texte: t('progres.niveaux.videTexte'),
        action: <Button label={t('progres.tests.ajouter')} onPress={() => ouvrirVue('tests', { ajouter: '1' })} />,
      }}>
      {donnees ? (
        <>
          {PROGRES_FICTIF ? <BadgeExemple style={styles.exemple} /> : null}
          <AppText variant="secondaire">{t('progres.niveaux.explication')}</AppText>
          {donnees.qualites.map((qualite) => (
            <CarteNiveauDetail
              key={qualite.qualite}
              qualite={qualite}
              onPress={() => ouvrirVue('niveaux', { qualite: qualite.qualite })}
            />
          ))}
          <QualitesATester manquantes={donnees.manquantes} />
        </>
      ) : null}
    </CadreVue>
  );
}

const styles = StyleSheet.create({
  exemple: { alignSelf: 'flex-start' },
});

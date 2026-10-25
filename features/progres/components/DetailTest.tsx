import { FlaskConical } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Toast } from '@/components/Toast';
import { colors, sizes } from '@/theme/tokens';

import { formatDateJour, formatValeur } from '../format';
import { libelleMethode, libelleTest } from '../presentation';
import { type FiltreTest, regrouperTests, trouverGroupe } from '../regroupement';
import { useFeuilleAjout } from '../useFeuilleAjout';
import { useTests, useTypesTests } from '../useTests';
import { CadreVue } from './CadreVue';
import { CourbeTest } from './CourbeTest';
import { FeuilleAjoutTest } from './FeuilleAjoutTest';
import { HistoriqueTest } from './HistoriqueTest';
import { InfosTypeTest } from './InfosTypeTest';

/** Détail d'un test (niveau 3) : dernière valeur en grand, courbe et résumé, à savoir, historique. */
export function DetailTest({ filtre }: { filtre: FiltreTest }) {
  const { t } = useTranslation();
  const tests = useTests();
  const types = useTypesTests();
  const feuille = useFeuilleAjout();
  const groupe = tests.data ? trouverGroupe(regrouperTests(tests.data), filtre) : undefined;
  const type = types.data?.find((ty) => ty.slug === filtre.type);
  const boutonAjouter = <Button label={t('progres.tests.ajouter')} onPress={() => feuille.ouvrir(filtre.type)} />;
  const details = groupe ? [formatDateJour(groupe.dernier.date_test), libelleMethode(groupe.dernier.methode)].filter(Boolean) : [];

  return (
    <CadreVue
      titre={groupe ? libelleTest(groupe) : (type?.nom ?? t('progres.vues.tests'))}
      sousTitre={t('progres.vues.tests')}
      requete={tests}
      vide={tests.data !== undefined && !groupe}
      etatVide={{
        icon: <FlaskConical color={colors.discret} size={sizes.icone * 2} />,
        titre: t('progres.tests.introuvableTitre'),
        texte: t('progres.tests.introuvableTexte'),
        action: boutonAjouter,
      }}
      pied={boutonAjouter}
      superpose={
        <>
          <FeuilleAjoutTest
            visible={feuille.visible}
            typeInitial={feuille.typeInitial}
            onFermer={feuille.fermer}
            onEnregistre={feuille.enregistre}
          />
          <Toast visible={feuille.confirmation} texte={t('progres.tests.enregistre')} />
        </>
      }>
      {groupe ? (
        <>
          <Card>
            <AppText variant="surTitre">{t('progres.tests.dernier')}</AppText>
            <AppText variant="chiffreXL" maxFontSizeMultiplier={1.3}>
              {formatValeur(groupe.dernier.valeur, groupe.type.unite)}
            </AppText>
            <AppText variant="secondaire">{details.join(' · ')}</AppText>
          </Card>
          <CourbeTest groupe={groupe} />
          {type ? <InfosTypeTest type={type} /> : null}
          <HistoriqueTest groupe={groupe} />
        </>
      ) : null}
    </CadreVue>
  );
}

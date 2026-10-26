import { FlaskConical } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Toast } from '@/components/Toast';
import { colors, sizes } from '@/theme/tokens';

import { ouvrirVue } from '../navigation';
import { filtreDe, regrouperTests } from '../regroupement';
import { useFeuilleAjout } from '../useFeuilleAjout';
import { useProgressions } from '../useSuiviServeur';
import { useTests } from '../useTests';
import { CadreVue } from './CadreVue';
import { FeuilleAjoutTest } from './FeuilleAjoutTest';
import { LigneTest } from './LigneTest';
import { ListeProgressions } from './ListeProgressions';

/** Vue Tests (niveau 2) : un test par ligne (dernière valeur, mini-courbe), le 1RM estimé, « Ajouter un résultat ». */
export function VueTests({ ajouter }: { ajouter?: string }) {
  const { t } = useTranslation();
  const tests = useTests();
  const progressions = useProgressions();
  const feuille = useFeuilleAjout(ajouter);
  const groupes = regrouperTests(tests.data ?? []);
  const e1rm = (progressions.data ?? []).filter((p) => p.exercices && (p.e1rm_recent ?? p.one_rep_max_kg) !== null);
  const vide = tests.data !== undefined && groupes.length === 0 && e1rm.length === 0;
  const boutonAjouter = <Button label={t('progres.tests.ajouter')} onPress={() => feuille.ouvrir()} />;

  return (
    <CadreVue
      titre={t('progres.vues.tests')}
      requete={tests}
      vide={vide}
      etatVide={{
        icon: <FlaskConical color={colors.discret} size={sizes.icone * 2} />,
        titre: t('progres.tests.videTitre'),
        texte: t('progres.tests.videTexte'),
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
      {groupes.length ? (
        <Card>
          {groupes.map((groupe) => (
            <LigneTest key={groupe.cle} groupe={groupe} onPress={() => ouvrirVue('tests', filtreDe(groupe))} />
          ))}
        </Card>
      ) : null}
      <ListeProgressions progressions={e1rm} />
    </CadreVue>
  );
}

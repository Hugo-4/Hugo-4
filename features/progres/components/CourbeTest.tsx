import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { GraphiqueCourbe } from '@/components/GraphiqueCourbe';

import { formatDateJour, formatValeur } from '../format';
import { libelleTest } from '../presentation';
import { type GroupeTest, tendanceDe } from '../regroupement';

/** Courbe d'un test + son résumé en texte (lu par le lecteur d'écran et affiché sous le tracé). */
export function CourbeTest({ groupe }: { groupe: GroupeTest }) {
  const { t } = useTranslation();
  const unite = groupe.type.unite;
  const premier = groupe.resultats[0];
  const tendance = tendanceDe(groupe);
  // Avec un tracé, le résumé est déjà lu sur le graphique : le texte visible n'est pas relu.
  const avecCourbe = groupe.resultats.length > 1;
  const resume = t('progres.tests.resume', {
    count: groupe.resultats.length,
    nom: libelleTest(groupe),
    premiere: formatValeur(premier.valeur, unite),
    debut: formatDateJour(premier.date_test),
    derniere: formatValeur(groupe.dernier.valeur, unite),
    fin: formatDateJour(groupe.dernier.date_test),
    tendance: tendance ? t(`progres.tests.tendance.${tendance}`) : '',
  });

  return (
    <Card>
      <AppText variant="surTitre">{t('progres.tests.evolution')}</AppText>
      {avecCourbe ? (
        <GraphiqueCourbe
          points={groupe.resultats.map((r) => ({ libelle: formatDateJour(r.date_test), valeur: r.valeur }))}
          resume={resume}
          formatValeur={(v) => formatValeur(v, unite)}
        />
      ) : null}
      <AppText variant="secondaire" importantForAccessibility={avecCourbe ? 'no' : 'auto'} accessibilityElementsHidden={avecCourbe}>
        {resume}
      </AppText>
    </Card>
  );
}

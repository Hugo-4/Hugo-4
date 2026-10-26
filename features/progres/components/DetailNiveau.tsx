import { Target } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { formatNombre } from '@/lib/format';
import { colors, sizes } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { formatDateJour, formatValeur } from '../format';
import { ouvrirVue } from '../navigation';
import { courbeDisponible, libelleComparaison, libelleGroupe, libelleMethode } from '../presentation';
import { PROGRES_FICTIF } from '../source';
import { useNiveaux } from '../useDonneesProgres';
import { useTypesTests } from '../useTests';
import { BadgeExemple } from './BadgeExemple';
import { CadreVue } from './CadreVue';

/**
 * Détail d'une qualité (niveau 3) : percentile en grand, groupe de comparaison, test d'origine.
 * « Voir la courbe du test » seulement si cette courbe existe (pas pour une estimation ni un test par exercice).
 */
export function DetailNiveau({ qualite: code }: { qualite: string }) {
  const { t } = useTranslation();
  const niveaux = useNiveaux();
  const types = useTypesTests();
  const qualite = niveaux.data?.qualites.find((q) => q.qualite === code);
  const testConseille = niveaux.data?.manquantes.find((m) => m.qualite === code)?.test_conseille?.slug;
  const pourcentage = qualite ? formatNombre(Math.round(qualite.percentile)) : '';
  const base = qualite
    ? [formatValeur(qualite.valeur, qualite.unite), libelleMethode(qualite.test.methode)].filter(Boolean).join(' · ')
    : '';

  return (
    <CadreVue
      titre={qualite?.libelle ?? t('progres.vues.niveaux')}
      sousTitre={t('progres.vues.niveaux')}
      requete={niveaux}
      vide={niveaux.data !== undefined && !qualite}
      etatVide={{
        icon: <Target color={colors.discret} size={sizes.icone * 2} />,
        titre: t('progres.niveaux.introuvableTitre'),
        texte: t('progres.niveaux.videTexte'),
        action: (
          <Button
            label={t('progres.tests.ajouter')}
            variant="secondaire"
            onPress={() => ouvrirVue('tests', { ajouter: testConseille ?? '1' })}
          />
        ),
      }}>
      {qualite ? (
        <>
          {PROGRES_FICTIF ? <BadgeExemple style={styles.exemple} /> : null}
          <Card>
            <AppText variant="titre" maxFontSizeMultiplier={multiplicateurMax}>
              {t('progres.niveaux.mieuxQue', { pourcentage })}
            </AppText>
            <ProgressBar
              progression={qualite.percentile / 100}
              accessibilityLabel={t('progres.niveaux.a11y', { qualite: qualite.libelle, pourcentage, groupe: libelleGroupe(qualite.groupe) })}
            />
            <AppText variant="secondaire">{libelleComparaison(qualite.groupe)}</AppText>
            <AppText variant="secondaire">{t('progres.niveaux.base', { date: formatDateJour(qualite.test.date), valeur: base })}</AppText>
          </Card>
          <AppText variant="secondaire">{t('progres.niveaux.explication')}</AppText>
          {courbeDisponible(qualite.test, types.data) ? (
            <Button
              label={t('progres.niveaux.voirTest')}
              variant="secondaire"
              onPress={() => ouvrirVue('tests', { type: qualite.test.slug })}
            />
          ) : null}
        </>
      ) : null}
    </CadreVue>
  );
}

const styles = StyleSheet.create({
  exemple: { alignSelf: 'flex-start' },
});

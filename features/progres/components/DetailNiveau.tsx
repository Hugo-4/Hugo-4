import { Target } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { ProgressBar } from '@/components/ProgressBar';
import { formatNombre } from '@/lib/format';
import { colors, sizes } from '@/theme/tokens';

import { formatDateJour, formatValeur } from '../format';
import { ouvrirVue } from '../navigation';
import { libelleComparaison, libelleGroupe, libelleMethode } from '../presentation';
import { PROGRES_FICTIF } from '../source';
import { useNiveaux } from '../useDonneesProgres';
import { BadgeExemple } from './BadgeExemple';
import { CadreVue } from './CadreVue';

/** Détail d'une qualité (niveau 3) : percentile en grand, groupe de comparaison, test d'origine. */
export function DetailNiveau({ qualite: code }: { qualite: string }) {
  const { t } = useTranslation();
  const niveaux = useNiveaux();
  const qualite = niveaux.data?.qualites.find((q) => q.qualite === code);
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
      }}>
      {qualite ? (
        <>
          {PROGRES_FICTIF ? <BadgeExemple style={styles.exemple} /> : null}
          <Card>
            <AppText variant="titre" maxFontSizeMultiplier={1.3}>
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
          <Button
            label={t('progres.niveaux.voirTest')}
            variant="secondaire"
            onPress={() => ouvrirVue('tests', { type: qualite.test.slug })}
          />
        </>
      ) : null}
    </CadreVue>
  );
}

const styles = StyleSheet.create({
  exemple: { alignSelf: 'flex-start' },
});

import { router } from 'expo-router';
import { CalendarCheck } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { PROGRES_FICTIF } from '../source';
import { useRegularite } from '../useDonneesProgres';
import { useAssiduite } from '../useSuiviServeur';
import { BadgeExemple } from './BadgeExemple';
import { CadreVue } from './CadreVue';
import { GrilleSemaines } from './GrilleSemaines';
import { ListeSemainesRegularite } from './ListeSemainesRegularite';
import { TexteSerie } from './TexteSerie';

/** Régularité (niveau 2) : semaines réussies, série en cours, semaine par semaine. Jamais culpabilisant. */
export function VueRegularite() {
  const { t } = useTranslation();
  const regularite = useRegularite();
  const assiduite = useAssiduite().data;
  const donnees = regularite.data;
  const taux = assiduite && assiduite.statut !== 'donnees_insuffisantes' ? assiduite.taux_28j : null;

  return (
    <CadreVue
      titre={t('progres.vues.regularite')}
      requete={regularite}
      vide={donnees !== undefined && donnees.semaines.length === 0}
      etatVide={{
        icon: <CalendarCheck color={colors.discret} size={sizes.icone * 2} />,
        titre: t('progres.regularite.videTitre'),
        texte: t('progres.regularite.videTexte'),
        action: <Button label={t('progres.voirProgramme')} variant="secondaire" onPress={() => router.navigate('/programme')} />,
      }}>
      {donnees ? (
        <>
          {PROGRES_FICTIF ? <BadgeExemple style={styles.exemple} /> : null}
          <Card>
            <View style={styles.chiffre}>
              <AppText variant="chiffreXL" maxFontSizeMultiplier={multiplicateurMax}>
                {t('progres.regularite.reussies', {
                  reussies: formatNombre(donnees.semaines_reussies),
                  total: formatNombre(donnees.semaines_comptees),
                })}
              </AppText>
              <AppText variant="secondaire">{t('progres.regularite.reussiesLibelle')}</AppText>
            </View>
            <TexteSerie regularite={donnees} />
            {donnees.meilleure_serie > 0 ? (
              <AppText variant="secondaire">{t('progres.regularite.meilleure', { count: donnees.meilleure_serie })}</AppText>
            ) : null}
            {taux !== null && taux !== undefined ? (
              <AppText variant="secondaire">{t('progres.regularite.taux28', { taux: formatNombre(taux) })}</AppText>
            ) : null}
            {donnees.regle ? <AppText variant="libelle">{donnees.regle}</AppText> : null}
          </Card>
          <GrilleSemaines semaines={donnees.semaines} />
          <ListeSemainesRegularite semaines={donnees.semaines} />
        </>
      ) : null}
    </CadreVue>
  );
}

const styles = StyleSheet.create({
  exemple: { alignSelf: 'flex-start' },
  chiffre: { flexDirection: 'row', alignItems: 'flex-end', gap: spacing.s, flexWrap: 'wrap' },
});

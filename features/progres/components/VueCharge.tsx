import { router } from 'expo-router';
import { Activity } from 'lucide-react-native';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, sizes } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import { formatValeur } from '../format';
import { zoneCharge } from '../presentation';
import { PROGRES_FICTIF } from '../source';
import { useChargeSemaines } from '../useDonneesProgres';
import { useChargeActuelle } from '../useSuiviServeur';
import { BadgeExemple } from './BadgeExemple';
import { CadreVue } from './CadreVue';
import { ExplicationCharge } from './ExplicationCharge';
import { GraphiqueCharge } from './GraphiqueCharge';
import { ListeSemainesCharge } from './ListeSemainesCharge';
import { ZoneChargeLibelle } from './ZoneChargeLibelle';

/** Vue Charge (niveau 2) : la semaine face à la zone optimale, barres par semaine, ACWR et monotonie expliqués. */
export function VueCharge() {
  const { t } = useTranslation();
  const charge = useChargeSemaines();
  const actuelle = useChargeActuelle().data;
  const donnees = charge.data;
  const semaine = donnees?.semaines[donnees.semaines.length - 1];
  const zone = actuelle?.donnees_suffisantes ? zoneCharge(actuelle.zone) : null;
  const vide = donnees !== undefined && (!semaine || donnees.semaines.every((s) => s.charge === 0));
  const insuffisant = actuelle?.donnees_suffisantes === false || donnees?.donnees_suffisantes === false;

  return (
    <CadreVue
      titre={t('progres.vues.charge')}
      requete={charge}
      vide={vide}
      etatVide={{
        icon: <Activity color={colors.discret} size={sizes.icone * 2} />,
        titre: t('progres.charge.videTitre'),
        texte: t('progres.charge.videTexte'),
        action: <Button label={t('progres.voirProgramme')} variant="secondaire" onPress={() => router.navigate('/programme')} />,
      }}>
      {donnees && semaine ? (
        <>
          {PROGRES_FICTIF ? <BadgeExemple style={styles.exemple} /> : null}
          <Card>
            <AppText variant="surTitre">{t('progres.charge.semaine')}</AppText>
            {zone ? <ZoneChargeLibelle zone={zone} /> : null}
            {insuffisant ? <AppText variant="secondaire">{t('progres.charge.insuffisant')}</AppText> : null}
            <AppText variant="chiffreXL" maxFontSizeMultiplier={multiplicateurMax}>
              {formatValeur(semaine.charge, donnees.unite)}
            </AppText>
            <AppText variant="libelle">{t('progres.charge.seances', { count: semaine.seances })}</AppText>
            {donnees.zone_optimale ? (
              <AppText variant="secondaire">
                {t('progres.charge.zoneOptimale', {
                  min: formatValeur(donnees.zone_optimale.min),
                  max: formatValeur(donnees.zone_optimale.max, donnees.unite),
                })}
              </AppText>
            ) : null}
          </Card>
          <GraphiqueCharge charge={donnees} />
          <ExplicationCharge actuelle={actuelle} unite={donnees.unite} />
          <ListeSemainesCharge charge={donnees} />
        </>
      ) : null}
    </CadreVue>
  );
}

const styles = StyleSheet.create({
  exemple: { alignSelf: 'flex-start' },
});

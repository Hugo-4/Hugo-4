import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { spacing } from '@/theme/tokens';
import { multiplicateurMax } from '@/theme/typography';

import type { EtatSection } from '../etats';
import { formatValeur } from '../format';
import { zoneCharge } from '../presentation';
import { PROGRES_FICTIF } from '../source';
import type { ChargeActuelle, ChargeSemaines } from '../types';
import { CarteSection } from './CarteSection';
import { ZoneChargeLibelle } from './ZoneChargeLibelle';

type Props = {
  charge: ChargeSemaines | undefined;
  /** `GET /profil` → `charge` : la zone vient du serveur (absente tant que la requête n'a pas répondu). */
  actuelle: ChargeActuelle | null | undefined;
  etat: EtatSection;
  onReessayer: () => void;
  onPress: () => void;
};

/** Charge de la semaine en cours par rapport à la zone optimale. */
export function CarteCharge({ charge, actuelle, etat, onReessayer, onPress }: Props) {
  const { t } = useTranslation();
  const semaine = charge?.semaines[charge.semaines.length - 1];
  const zone = actuelle?.donnees_suffisantes ? zoneCharge(actuelle.zone) : null;
  const vide = !semaine || charge?.semaines.every((s) => s.charge === 0);

  return (
    <CarteSection
      titre={t('progres.charge.titre')}
      etat={etat}
      onReessayer={onReessayer}
      onPress={vide ? undefined : onPress}
      exemple={PROGRES_FICTIF}>
      {zone ? <ZoneChargeLibelle zone={zone} /> : null}
      {actuelle && !actuelle.donnees_suffisantes ? <AppText variant="secondaire">{t('progres.charge.insuffisant')}</AppText> : null}
      {semaine && !vide ? (
        <View style={styles.bloc}>
          <AppText variant="chiffreXL" maxFontSizeMultiplier={multiplicateurMax}>
            {formatValeur(semaine.charge, charge?.unite)}
          </AppText>
          <AppText variant="libelle">
            {t('progres.charge.semaineSeances', { seances: t('progres.charge.seances', { count: semaine.seances }) })}
          </AppText>
          {charge?.zone_optimale ? (
            <AppText variant="secondaire">
              {t('progres.charge.zoneOptimale', {
                min: formatValeur(charge.zone_optimale.min),
                max: formatValeur(charge.zone_optimale.max, charge.unite),
              })}
            </AppText>
          ) : null}
        </View>
      ) : (
        <AppText variant="secondaire">{t('progres.charge.videTexte')}</AppText>
      )}
    </CarteSection>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
});

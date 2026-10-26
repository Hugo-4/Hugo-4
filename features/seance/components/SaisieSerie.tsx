import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ChoixNote } from '@/components/ChoixNote';
import { PasAPas } from '@/components/PasAPas';
import { formatNombre } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import { type Mesure, type Saisie } from '../saisie';

export const RPE_PROPOSES = [6, 7, 8, 9, 10];

type Props = {
  saisie: Saisie;
  mesure: Mesure;
  pasCharge: number;
  /** RPE prescrit : affiché comme repère tant que l'athlète n'a pas donné le sien. */
  rpeCible: number | null;
  onChange: (saisie: Saisie) => void;
};

/** Charge et répétitions (ou durée) préremplies, puis le RPE en un geste. */
export function SaisieSerie({ saisie, mesure, pasCharge, rpeCible, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <View style={styles.ligne}>
        {saisie.charge !== null ? (
          <PasAPas
            libelle={t('enSeance.charge')}
            unite={t('enSeance.uniteKg')}
            valeur={saisie.charge}
            pas={pasCharge}
            onChange={(charge) => onChange({ ...saisie, charge })}
          />
        ) : null}
        {mesure === 'reps' ? (
          <PasAPas
            libelle={t('enSeance.reps')}
            unite={t('enSeance.uniteReps')}
            valeur={saisie.reps}
            pas={1}
            max={200}
            onChange={(reps) => onChange({ ...saisie, reps })}
          />
        ) : (
          <PasAPas
            libelle={t('enSeance.duree')}
            unite={t('enSeance.uniteSecondes')}
            valeur={saisie.duree}
            pas={5}
            max={3600}
            onChange={(duree) => onChange({ ...saisie, duree })}
          />
        )}
      </View>
      <ChoixNote
        libelle={t('enSeance.rpe')}
        valeurs={RPE_PROPOSES}
        valeur={saisie.rpe}
        onChange={(rpe) => onChange({ ...saisie, rpe })}
        a11yValeur={(rpe) => t('enSeance.a11yRpe', { rpe })}
      />
      {saisie.rpe === null && rpeCible !== null ? (
        <AppText variant="libelle">{t('enSeance.rpeCible', { rpe: formatNombre(rpeCible, 1) })}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
  ligne: { flexDirection: 'row', gap: spacing.m },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { TextField } from './TextField';

export type ValeurDate = { jour: string; mois: string; annee: string };

type Props = {
  label: string;
  valeur: ValeurDate;
  onChange: (valeur: ValeurDate) => void;
  erreur?: string;
};

const chiffres = (texte: string, max: number) => texte.replace(/\D/g, '').slice(0, max);

/** Date saisie en trois champs numériques (jour, mois, année), sans dépendance externe. */
export function DateField({ label, valeur, onChange, erreur }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <AppText variant="libelle" color={colors.texte2}>
        {label}
      </AppText>
      <View style={styles.ligne}>
        <View style={styles.court}>
          <TextField
            label={t('commun.date.jour')}
            value={valeur.jour}
            onChangeText={(jour) => onChange({ ...valeur, jour: chiffres(jour, 2) })}
            keyboardType="number-pad"
            placeholder="15"
          />
        </View>
        <View style={styles.court}>
          <TextField
            label={t('commun.date.mois')}
            value={valeur.mois}
            onChangeText={(mois) => onChange({ ...valeur, mois: chiffres(mois, 2) })}
            keyboardType="number-pad"
            placeholder="06"
          />
        </View>
        <View style={styles.long}>
          <TextField
            label={t('commun.date.annee')}
            value={valeur.annee}
            onChangeText={(annee) => onChange({ ...valeur, annee: chiffres(annee, 4) })}
            keyboardType="number-pad"
            placeholder="2001"
          />
        </View>
      </View>
      {erreur ? (
        <AppText variant="libelle" color={colors.alerte}>
          {erreur}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  ligne: { flexDirection: 'row', gap: spacing.s },
  court: { flex: 1 },
  long: { flex: 1.6 },
});

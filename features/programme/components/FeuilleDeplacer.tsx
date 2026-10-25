import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { DateField } from '@/components/DateField';
import { Feuille } from '@/components/Feuille';
import { formatJourDate } from '@/lib/format';
import { useTexteErreur } from '@/lib/texteErreur';
import { colors, spacing } from '@/theme/tokens';

import { useDeplacement } from '../useDeplacement';

type Props = {
  visible: boolean;
  programmeSeanceId: string;
  dateActuelle: string;
  onFermer: () => void;
  onDeplacee: (date: string) => void;
};

/** Déplacer une séance : puces des 7 prochains jours ou date saisie, puis confirmation avec la date choisie. */
export function FeuilleDeplacer({ visible, programmeSeanceId, dateActuelle, onFermer, onDeplacee }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const d = useDeplacement(programmeSeanceId, dateActuelle, onDeplacee);
  const fermer = () => {
    d.reinitialiser();
    onFermer();
  };

  return (
    <Feuille visible={visible} titre={t('programme.deplacer.titre')} onFermer={fermer}>
      <AppText variant="secondaire">{t('programme.deplacer.aide', { date: formatJourDate(dateActuelle) })}</AppText>
      <View style={styles.puces} accessibilityRole="radiogroup" accessibilityLabel={t('programme.deplacer.jours')}>
        {d.puces.map((date) => (
          <Chip key={date} role="radio" label={formatJourDate(date)} selectionne={d.puce === date} onPress={() => d.choisirPuce(date)} />
        ))}
      </View>
      <DateField
        label={t('programme.deplacer.autreDate')}
        valeur={d.saisie}
        onChange={d.changerSaisie}
        erreur={d.saisieInvalide ? t('programme.deplacer.dateInvalide') : undefined}
      />
      {d.refus ? (
        <AppText variant="corps" color={colors.alerte} accessibilityRole="alert">
          {t('programme.deplacer.refus', { raison: d.refus })}
        </AppText>
      ) : null}
      {d.erreur ? (
        <AppText variant="corps" color={colors.alerte} accessibilityRole="alert">
          {texteErreur(d.erreur) ?? t('programme.erreurEnregistrement')}
        </AppText>
      ) : null}
      <Button
        label={d.date ? t('programme.deplacer.confirmer', { date: formatJourDate(d.date) }) : t('programme.deplacer.choisir')}
        onPress={d.confirmer}
        disabled={!d.date || d.enCours}
      />
    </Feuille>
  );
}

const styles = StyleSheet.create({
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

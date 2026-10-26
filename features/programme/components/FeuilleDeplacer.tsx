import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { DateField } from '@/components/DateField';
import { Feuille } from '@/components/Feuille';
import { formatJourDate } from '@/lib/format';
import { useTexteErreur } from '@/lib/texteErreur';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, spacing } from '@/theme/tokens';

import { useDeplacement } from '../useDeplacement';
import { AvisHorsLigne } from './AvisHorsLigne';

type Props = {
  visible: boolean;
  programmeSeanceId: string;
  dateActuelle: string;
  onFermer: () => void;
  onDeplacee: (date: string) => void;
};

/** Déplacer une séance : puces des jours permis (± 6 jours, pas dans le passé) ou date saisie, puis confirmation. */
export function FeuilleDeplacer({ visible, programmeSeanceId, dateActuelle, onFermer, onDeplacee }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const enLigne = useEnLigne();
  const d = useDeplacement(programmeSeanceId, dateActuelle, onDeplacee);
  const fenetre = { debut: formatJourDate(d.debut), fin: formatJourDate(d.fin) };
  const fermer = () => {
    d.reinitialiser();
    onFermer();
  };

  return (
    <Feuille visible={visible} titre={t('programme.deplacer.titre')} onFermer={fermer}>
      {d.puces.length ? (
        <AppText variant="secondaire">{t('programme.deplacer.aide', { date: formatJourDate(dateActuelle), ...fenetre })}</AppText>
      ) : (
        <AppText variant="secondaire">{t('programme.deplacer.aucuneDate', { date: formatJourDate(dateActuelle) })}</AppText>
      )}
      {d.puces.length ? (
        <>
          <View style={styles.puces} accessibilityRole="radiogroup" accessibilityLabel={t('programme.deplacer.jours')}>
            {d.puces.map((date) => (
              <Chip key={date} role="radio" label={formatJourDate(date)} selectionne={d.puce === date} onPress={() => d.choisirPuce(date)} />
            ))}
          </View>
          <DateField
            label={t('programme.deplacer.autreDate')}
            valeur={d.saisie}
            onChange={d.changerSaisie}
            erreur={d.saisieInvalide ? t('programme.deplacer.dateInvalide', fenetre) : undefined}
          />
        </>
      ) : null}
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
      {enLigne ? null : <AvisHorsLigne />}
      <Button
        label={d.date ? t('programme.deplacer.confirmer', { date: formatJourDate(d.date) }) : t('programme.deplacer.choisir')}
        onPress={d.confirmer}
        disabled={!d.date || d.enCours || !enLigne}
      />
    </Feuille>
  );
}

const styles = StyleSheet.create({
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

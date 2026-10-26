import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { formatNombre } from '@/lib/format';
import { useTexteErreur } from '@/lib/texteErreur';
import { colors, spacing } from '@/theme/tokens';

import { formatDateJour } from '../format';
import type { Ligue } from '../types';

type Props = {
  ligue: Ligue;
  enCours: boolean;
  /** Échec de « Rejoindre » / « Quitter » pour cette ligue : le message du serveur s'affiche dessous. */
  erreur: unknown;
  onInscription: (rejoindre: boolean) => void;
};

/** Une ligue (au choix) : critère de performance, rang si l'athlète l'a rejointe, échéance, Rejoindre / Quitter. */
export function LigneLigue({ ligue, enCours, erreur, onInscription }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const details = [
    ligue.critere_libelle,
    ligue.inscrit && ligue.rang !== null
      ? t('progres.ligues.rang', { rang: formatNombre(ligue.rang), participants: formatNombre(ligue.participants) })
      : t('progres.ligues.participants', { count: ligue.participants, nombre: formatNombre(ligue.participants) }),
    ligue.fin ? t('progres.ligues.jusquau', { date: formatDateJour(ligue.fin) }) : null,
  ].filter(Boolean);

  return (
    <View style={styles.bloc}>
      <View style={styles.textes} accessible>
        <AppText variant="corpsGras">{ligue.nom}</AppText>
        <AppText variant="libelle">{details.join(' · ')}</AppText>
      </View>
      <Button
        label={t(ligue.inscrit ? 'progres.ligues.quitter' : 'progres.ligues.rejoindre')}
        variant="secondaire"
        onPress={() => onInscription(!ligue.inscrit)}
        disabled={enCours}
      />
      {erreur ? (
        <AppText variant="secondaire" color={colors.alerte} accessibilityRole="alert">
          {texteErreur(erreur) ?? t('progres.ligues.erreurInscription')}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  textes: { gap: spacing.xxs },
});

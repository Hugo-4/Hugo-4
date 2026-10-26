import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { spacing } from '@/theme/tokens';

import { formatDateJour, formatValeur } from '../format';
import type { Defi } from '../types';

type Props = { defi: Defi; avecDescription?: boolean };

/** Un défi : nom et description (textes du serveur), avancement en texte et en barre, échéance. */
export function LigneDefi({ defi, avecDescription }: Props) {
  const { t } = useTranslation();
  const avancement = t('progres.ligues.avancement', {
    actuelle: formatValeur(defi.valeur_actuelle),
    cible: formatValeur(defi.valeur_cible, defi.unite),
  });
  return (
    <View style={styles.bloc}>
      <View style={styles.ligne}>
        <AppText variant="corpsGras" style={styles.nom}>
          {defi.nom}
        </AppText>
        <AppText variant="secondaire">{avancement}</AppText>
      </View>
      {avecDescription && defi.description ? <AppText variant="secondaire">{defi.description}</AppText> : null}
      <ProgressBar
        progression={defi.valeur_cible > 0 ? defi.valeur_actuelle / defi.valeur_cible : 0}
        accessibilityLabel={t('progres.ligues.a11yDefi', { nom: defi.nom, avancement })}
      />
      {defi.date_expiration ? (
        <AppText variant="libelle">{t('progres.ligues.jusquau', { date: formatDateJour(defi.date_expiration) })}</AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  nom: { flex: 1 },
});

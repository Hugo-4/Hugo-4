import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Feuille } from '@/components/Feuille';
import { Interrupteur } from '@/components/Interrupteur';
import { TextField } from '@/components/TextField';
import { useTexteErreur } from '@/lib/texteErreur';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, spacing } from '@/theme/tokens';

import { RAISON_MAX } from '../constantes';
import type { ReponseManquee } from '../types';
import { useDeclarationManquee } from '../useDeclarationManquee';
import { AvisHorsLigne } from './AvisHorsLigne';

type Props = {
  visible: boolean;
  programmeSeanceId: string;
  onFermer: () => void;
  onFait: (reponse: ReponseManquee) => void;
};

/** Signaler une séance manquée : pourquoi (puces), précision facultative, et faut-il la replacer cette semaine. */
export function FeuilleManquee({ visible, programmeSeanceId, onFermer, onFait }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const enLigne = useEnLigne();
  const m = useDeclarationManquee(programmeSeanceId, onFait);
  const fermer = () => {
    m.reinitialiser();
    onFermer();
  };

  return (
    <Feuille visible={visible} titre={t('programme.manquee.titre')} onFermer={fermer}>
      <AppText variant="corpsGras">{t('programme.manquee.pourquoi')}</AppText>
      <View style={styles.puces} accessibilityRole="radiogroup" accessibilityLabel={t('programme.manquee.pourquoi')}>
        {m.categories.map((c) => (
          <Chip key={c} role="radio" label={t(`programme.manquee.categories.${c}`)} selectionne={m.categorie === c} onPress={() => m.choisirCategorie(c)} />
        ))}
      </View>
      {m.sansConsentementSante ? <AppText variant="libelle">{t('programme.manquee.sansConsentement')}</AppText> : null}
      <TextField
        label={t('programme.manquee.raison')}
        value={m.raison}
        onChangeText={m.changerRaison}
        maxLength={RAISON_MAX}
        multiline
      />
      <Interrupteur libelle={t('programme.manquee.reporter')} aide={t('programme.manquee.reporterAide')} valeur={m.reporter} onChange={m.changerReporter} />
      {m.erreur ? (
        <AppText variant="corps" color={colors.alerte} accessibilityRole="alert">
          {texteErreur(m.erreur) ?? t('programme.erreurEnregistrement')}
        </AppText>
      ) : null}
      {enLigne ? null : <AvisHorsLigne />}
      <Button label={t('programme.manquee.envoyer')} onPress={m.envoyer} disabled={!m.categorie || m.enCours || !enLigne} />
    </Feuille>
  );
}

const styles = StyleSheet.create({
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

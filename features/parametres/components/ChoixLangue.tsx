import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import { LANGUES } from '@/lib/i18n';
import { spacing } from '@/theme/tokens';

import { useChangerLangue } from '../useLangue';

/** Langue de l'app : enregistrée dans le profil (`users.langue`), puis appliquée partout. */
export function ChoixLangue() {
  const { t, i18n } = useTranslation();
  const changement = useChangerLangue();
  const choisie = changement.isPending ? changement.variables : i18n.language;

  return (
    <SectionProfil titre={t('parametres.preferences.langue')}>
      <AppText variant="secondaire">{t('parametres.preferences.langueAide')}</AppText>
      <View style={styles.ligne} accessibilityRole="radiogroup" accessibilityLabel={t('parametres.preferences.langue')}>
        {LANGUES.map((langue) => (
          <Chip
            key={langue}
            role="radio"
            label={t(`inscription.langues.${langue}`)}
            selectionne={choisie === langue}
            onPress={() => langue !== i18n.language && !changement.isPending && changement.mutate(langue)}
          />
        ))}
      </View>
      {changement.isError ? <ErreurEnregistrement erreur={changement.error} /> : null}
    </SectionProfil>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
});

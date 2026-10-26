import { useQueryClient } from '@tanstack/react-query';
import { CalendarDays } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { useGenererProgramme } from '@/features/inscription/useGenererProgramme';
import { colors, sizes, spacing } from '@/theme/tokens';

import { CLE_ACCUEIL } from '../useAccueil';

/** Aucun programme (génération échouée ou pas encore faite) : explication et « Générer mon programme ». */
export function AucunProgramme() {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const generation = useGenererProgramme();
  const generer = () =>
    generation.mutate(undefined, {
      onSettled: () => queryClient.invalidateQueries({ queryKey: CLE_ACCUEIL }),
    });

  return (
    <View style={styles.bloc}>
      <BandeauHorsLigne />
      <EmptyState
        icon={<CalendarDays color={colors.discret} size={sizes.icone * 2} />}
        titre={t('accueil.videTitre')}
        texte={t('accueil.videTexte')}
      />
      {generation.isPending ? <AppText variant="secondaire">{t('accueil.generationEnCours')}</AppText> : null}
      {generation.isError ? <ErreurEnregistrement erreur={generation.error} /> : null}
      <Button label={t('accueil.genererProgramme')} onPress={generer} disabled={generation.isPending} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { flex: 1, justifyContent: 'center', gap: spacing.l, padding: spacing.ecran },
});

import { router } from 'expo-router';
import { Flag } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Evenement } from '../types';
import { trierEvenements } from '../useEvenements';
import { GroupeRubriques } from './GroupeRubriques';
import { LigneEvenement } from './LigneEvenement';

/** Compétitions (prochaines en premier, puis passées) et « + Compétition ». */
export function ListeCompetitions({ evenements }: { evenements: Evenement[] }) {
  const { t } = useTranslation();
  const { aVenir, passes } = trierEvenements(evenements);
  const ajouter = (
    <Button
      label={t('parametres.objectifs.ajouter')}
      variant="secondaire"
      onPress={() => router.push('/programme/evenement/nouveau')}
    />
  );

  if (evenements.length === 0) {
    return (
      <View style={styles.bloc}>
        <AppText variant="surTitre" accessibilityRole="header">
          {t('parametres.objectifs.competitions')}
        </AppText>
        <EmptyState
          icon={<Flag color={colors.discret} size={sizes.icone * 2} />}
          titre={t('parametres.objectifs.videTitre')}
          texte={t('parametres.objectifs.videTexte')}
        />
        {ajouter}
      </View>
    );
  }

  return (
    <View style={styles.bloc}>
      <GroupeRubriques titre={`${t('parametres.objectifs.competitions')} · ${t('parametres.objectifs.aVenir')}`}>
        {aVenir.length === 0 ? <AppText variant="secondaire">{t('parametres.objectifs.videTitre')}</AppText> : null}
        {aVenir.map((e) => (
          <LigneEvenement key={e.id} evenement={e} aVenir />
        ))}
      </GroupeRubriques>
      {ajouter}
      {passes.length > 0 ? (
        <GroupeRubriques titre={t('parametres.objectifs.passees')}>
          {passes.map((e) => (
            <LigneEvenement key={e.id} evenement={e} aVenir={false} />
          ))}
        </GroupeRubriques>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.l },
});

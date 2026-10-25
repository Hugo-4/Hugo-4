import { router } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { LigneListe } from '@/components/LigneListe';
import { formatJourDate } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Evenement } from '../types';

type Props = {
  competitions: Evenement[];
  /** Aucune compétition A prévue : on explique à quoi elle sert. */
  sansObjectifA: boolean;
};

/** Compétitions prévues (chaque ligne ouvre la compétition) et [S] « + Compétition ». */
export function CompetitionsAVenir({ competitions, sansObjectifA }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc}>
      <AppText variant="surTitre" accessibilityRole="header">
        {t('programme.competitions.titre')}
      </AppText>
      {sansObjectifA ? <AppText variant="secondaire">{t('programme.objectif.aucun')}</AppText> : null}
      {competitions.map((e) => (
        <LigneListe
          key={e.id}
          icon={<Trophy color={e.priorite === 'A' ? colors.accent : colors.texte2} size={sizes.icone} />}
          titre={e.nom}
          sousTitre={[formatJourDate(e.date_evenement), e.sports?.nom].filter(Boolean).join(' · ')}
          valeur={t('programme.competitions.priorite', { priorite: e.priorite })}
          onPress={() => router.push({ pathname: '/programme/evenement/[id]', params: { id: e.id } })}
        />
      ))}
      <Button
        label={t('programme.competitions.ajouter')}
        variant="secondaire"
        onPress={() => router.push('/programme/evenement/nouveau')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

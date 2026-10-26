import type { UseQueryResult } from '@tanstack/react-query';
import { router } from 'expo-router';
import { Trophy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { LigneListe } from '@/components/LigneListe';
import { Skeleton } from '@/components/Skeleton';
import { formatJourDate } from '@/lib/format';
import { useTexteErreur } from '@/lib/texteErreur';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Evenement } from '../types';

type Props = {
  /** `GET /evenements` : ses propres états (chargement, erreur avec Réessayer, hors ligne sans cache). */
  requete: UseQueryResult<Evenement[]>;
  competitions: Evenement[];
  /** Aucune compétition A prévue : on explique à quoi elle sert (seulement si la liste a bien été reçue). */
  sansObjectifA: boolean;
};

/** Compétitions prévues (chaque ligne ouvre la compétition) et [S] « + Compétition », toujours proposé. */
export function CompetitionsAVenir({ requete, competitions, sansObjectifA }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const recue = requete.data !== undefined;
  return (
    <View style={styles.bloc}>
      <AppText variant="surTitre" accessibilityRole="header">
        {t('programme.competitions.titre')}
      </AppText>
      {recue && sansObjectifA ? <AppText variant="secondaire">{t('programme.objectif.aucun')}</AppText> : null}
      {!recue && requete.isError ? (
        <View style={styles.bloc} accessibilityRole="alert">
          <AppText variant="secondaire">{texteErreur(requete.error) ?? t('programme.competitions.erreur')}</AppText>
          <Button label={t('commun.reessayer')} variant="secondaire" onPress={() => requete.refetch()} />
        </View>
      ) : null}
      {!recue && !requete.isError && requete.fetchStatus === 'paused' ? (
        <AppText variant="secondaire">{t('programme.competitions.horsLigne')}</AppText>
      ) : null}
      {!recue && !requete.isError && requete.fetchStatus !== 'paused' ? <Skeleton hauteur={sizes.cibleTactile} /> : null}
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

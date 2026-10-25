import type { UseQueryResult } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { useTexteErreur } from '@/lib/texteErreur';
import { opacity, sizes, spacing } from '@/theme/tokens';

import type { Calendrier, JourCalendrier, Legende } from '../types';
import { EnteteMois } from './EnteteMois';
import { GrilleMois } from './GrilleMois';

type Props = {
  mois: string;
  calendrier: UseQueryResult<Calendrier>;
  legende?: Legende;
  onMois: (decalage: number) => void;
  onJour: (jour: JourCalendrier) => void;
  onLegende: () => void;
};

/** Calendrier du mois : navigation, grille, et ses propres états (chargement du mois, erreur avec Réessayer). */
export function CalendrierCarte({ mois, calendrier, legende, onMois, onJour, onLegende }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const donnees = calendrier.data;
  // Pendant le chargement d'un autre mois, l'ancien reste en mémoire : on n'en montre pas les jours.
  const duMois = donnees?.mois === mois ? donnees : undefined;

  return (
    <Card>
      <EnteteMois mois={mois} onPrecedent={() => onMois(-1)} onSuivant={() => onMois(1)} />
      {duMois || calendrier.isFetching ? (
        <View style={duMois ? undefined : styles.attente}>
          <GrilleMois mois={mois} jours={duMois?.jours ?? []} legende={legende} onJour={onJour} />
        </View>
      ) : calendrier.isError ? (
        <View style={styles.erreur} accessibilityRole="alert">
          <AppText variant="secondaire">{texteErreur(calendrier.error) ?? t('programme.calendrier.erreur')}</AppText>
          <Button label={t('commun.reessayer')} variant="secondaire" onPress={() => calendrier.refetch()} />
        </View>
      ) : calendrier.fetchStatus === 'paused' ? (
        <AppText variant="secondaire">{t('programme.calendrier.horsLigne')}</AppText>
      ) : (
        <Skeleton hauteur={sizes.graphique * 2} />
      )}
      <Button label={t('programme.calendrier.legende')} variant="discret" onPress={onLegende} />
    </Card>
  );
}

const styles = StyleSheet.create({
  attente: { opacity: opacity.desactive },
  erreur: { gap: spacing.m },
});

import type { UseQueryResult } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ErrorState } from '@/components/ErrorState';
import { LigneListe } from '@/components/LigneListe';
import { Skeleton } from '@/components/Skeleton';
import { TextField } from '@/components/TextField';
import { sizes, spacing } from '@/theme/tokens';

import { formatQuantite } from '../format';
import type { Aliment } from '../types';

type Props = {
  recherche: string;
  onRecherche: (texte: string) => void;
  resultats: UseQueryResult<Aliment[]>;
  onChoisir: (aliment: Aliment) => void;
  onSaisirALaMain: () => void;
};

/** Recherche dans la base d'aliments ; un aliment absent peut être saisi à la main. */
export function ListeAliments({ recherche, onRecherche, resultats, onChoisir, onSaisirALaMain }: Props) {
  const { t } = useTranslation();
  const liste = resultats.data ?? [];
  return (
    <View style={styles.bloc}>
      <TextField
        label={t('nutrition.ajout.rechercher')}
        placeholder={t('nutrition.ajout.rechercherExemple')}
        value={recherche}
        onChangeText={onRecherche}
        autoCorrect={false}
        returnKeyType="search"
      />
      {resultats.isPending ? [0, 1, 2, 3].map((i) => <Skeleton key={i} hauteur={sizes.cibleTactile} />) : null}
      {resultats.isError && !resultats.data ? <ErrorState onRetry={resultats.refetch} erreur={resultats.error} /> : null}
      {resultats.data && liste.length === 0 ? <AppText variant="secondaire">{t('nutrition.ajout.aucunResultat')}</AppText> : null}
      {liste.map((a) => (
        <LigneListe
          key={a.id}
          titre={a.nom}
          sousTitre={t('nutrition.ajout.pour100', { kcal: formatQuantite(Number(a.calories_100g ?? 0)) })}
          onPress={() => onChoisir(a)}
        />
      ))}
      <Button label={t('nutrition.ajout.saisirALaMain')} variant="secondaire" onPress={onSaisirALaMain} />
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.m },
});

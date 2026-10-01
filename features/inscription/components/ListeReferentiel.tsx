import type { UseQueryResult } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';

import { ChoixOption } from '@/components/ChoixOption';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { sizes, spacing } from '@/theme/tokens';

import type { Referentiel } from '../useReferentiels';

type Props = {
  requete: UseQueryResult<Referentiel[]>;
  libelle: (item: Referentiel) => string;
  description?: (item: Referentiel) => string | undefined;
  estSelectionne: (id: string) => boolean;
  onChoisir: (id: string) => void;
  multiple?: boolean;
  /** Identifiants à ne pas proposer (ex. le sport principal parmi les sports secondaires). */
  exclus?: string[];
};

/** Liste de choix venant de la base, avec états chargement et erreur. */
export function ListeReferentiel({ requete, libelle, description, estSelectionne, onChoisir, multiple, exclus }: Props) {
  if (requete.isPending) {
    return (
      <View style={styles.liste}>
        {[0, 1, 2, 3, 4].map((i) => (
          <Skeleton key={i} hauteur={sizes.cibleTactile + spacing.m} />
        ))}
      </View>
    );
  }
  if (requete.isError) {
    return <ErrorState onRetry={requete.refetch} />;
  }
  return (
    <View style={styles.liste}>
      {requete.data
        .filter((item) => !exclus?.includes(item.id))
        .map((item) => (
          <ChoixOption
            key={item.id}
            role={multiple ? 'checkbox' : 'radio'}
            titre={libelle(item)}
            description={description?.(item)}
            selectionne={estSelectionne(item.id)}
            onPress={() => onChoisir(item.id)}
          />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});

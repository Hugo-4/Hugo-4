import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ChoixOption } from '@/components/ChoixOption';
import { ErrorState } from '@/components/ErrorState';
import { Skeleton } from '@/components/Skeleton';
import { AMBITIONS, type Ambition } from '@/features/inscription/constantes';
import { texteLocal } from '@/features/inscription/libelles';
import { useObjectifsSport } from '@/features/inscription/useReferentiels';
import { colors, sizes, spacing } from '@/theme/tokens';

type Props = {
  sportId: string;
  ambition: Ambition | null;
  objectifId: string | null;
  onAmbition: (ambition: Ambition) => void;
  onObjectif: (objectifId: string) => void;
};

/** Ambition puis objectif précis du sport principal (mêmes données que l'inscription). */
export function ChoixObjectifPrincipal({ sportId, ambition, objectifId, onAmbition, onObjectif }: Props) {
  const { t } = useTranslation();
  const objectifs = useObjectifsSport(sportId);
  if (objectifs.isPending) return <Skeleton hauteur={sizes.anneauForme} />;
  if (objectifs.isError) return <ErrorState onRetry={objectifs.refetch} />;

  return (
    <View style={styles.bloc}>
      <AppText variant="corpsGras" color={colors.texte2}>
        {t('inscription.etapes.ambition.titre')}
      </AppText>
      {AMBITIONS.filter((a) => objectifs.data.some((o) => o.ambition === a)).map((a) => (
        <ChoixOption key={a} titre={t(`inscription.ambition.${a}`)} selectionne={ambition === a} onPress={() => onAmbition(a)} />
      ))}
      <AppText variant="corpsGras" color={colors.texte2}>
        {t('inscription.etapes.objectifSport.titre')}
      </AppText>
      {objectifs.data
        .filter((o) => o.ambition === ambition)
        .map((o) => (
          <ChoixOption key={o.id} titre={texteLocal(o.libelle)} selectionne={objectifId === o.id} onPress={() => onObjectif(o.id)} />
        ))}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

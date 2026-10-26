import type { UseQueryResult } from '@tanstack/react-query';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Skeleton } from '@/components/Skeleton';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { TypeTest } from '../types';

type Props = {
  types: UseQueryResult<TypeTest[]>;
  valeur: string | null;
  onChange: (slug: string) => void;
  erreur: boolean;
};

/** Choix du test (liste `GET /tests/types`), en puces à choix unique. */
export function ChoixTypeTest({ types, valeur, onChange, erreur }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.bloc} accessibilityRole="radiogroup" accessibilityLabel={t('progres.ajout.type')}>
      <AppText variant="libelle" color={colors.texte2}>
        {t('progres.ajout.type')}
      </AppText>
      {types.isPending && types.fetchStatus === 'fetching' ? <Skeleton hauteur={sizes.pasAPas} /> : null}
      {types.data === undefined && !(types.isPending && types.fetchStatus === 'fetching') ? (
        <View style={styles.ligne}>
          <AppText variant="secondaire" style={styles.texte}>
            {t('progres.ajout.erreurTypes')}
          </AppText>
          <Button label={t('commun.reessayer')} variant="secondaire" onPress={() => types.refetch()} />
        </View>
      ) : null}
      <View style={styles.puces}>
        {(types.data ?? []).map((type) => (
          <Chip
            key={type.slug}
            label={type.nom}
            role="radio"
            selectionne={type.slug === valeur}
            onPress={() => onChange(type.slug)}
          />
        ))}
      </View>
      {erreur ? (
        <AppText variant="libelle" color={colors.alerte} accessibilityLiveRegion="polite">
          {t('progres.ajout.erreurs.type')}
        </AppText>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  texte: { flex: 1 },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

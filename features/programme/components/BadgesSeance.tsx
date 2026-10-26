import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { libelleBadge } from '../presentation';
import type { Legende } from '../types';

type Props = { badges: string[]; legende?: Legende };

/**
 * Badges renvoyés par le serveur (`cle`, `allegee`, `modifiee`, `deplacee`…), en étiquettes de texte :
 * code traduit par l'app, sinon libellé de la légende du serveur. Lus en une phrase par le lecteur d'écran.
 */
export function BadgesSeance({ badges, legende }: Props) {
  const { t } = useTranslation();
  if (!badges.length) return null;
  const libelles = badges.map((code) => libelleBadge(code, legende));
  return (
    <View style={styles.ligne} accessible accessibilityLabel={t('programme.seance.a11yBadges', { liste: libelles.join(', ') })}>
      {libelles.map((libelle, i) => (
        <View key={badges[i]} style={styles.badge}>
          <AppText variant="libelle" color={colors.texte2}>
            {libelle}
          </AppText>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  badge: {
    paddingHorizontal: spacing.s,
    paddingVertical: spacing.xs,
    borderRadius: radius.petit,
    borderWidth: sizes.bordure,
    borderColor: colors.ligne,
    backgroundColor: colors.carte2,
  },
});

import { X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { IconButton } from '@/components/IconButton';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import type { Douleur } from '../types';

type Props = {
  douleur: Douleur;
  onRetirer: () => void;
};

export function DouleurLigne({ douleur, onRetirer }: Props) {
  const { t } = useTranslation();
  const libelle = [
    t(`inscription.douleurs.natures.${douleur.nature}`),
    t(`inscription.zones.${douleur.zone}`),
    t(`inscription.douleurs.cotes.${douleur.cote}`),
    t(`inscription.douleurs.gravites.${douleur.gravite}`),
  ].join(' · ');

  return (
    <View style={styles.ligne}>
      <AppText variant="corps" style={styles.texte}>
        {libelle}
      </AppText>
      <IconButton accessibilityLabel={t('inscription.douleurs.retirer', { douleur: libelle })} onPress={onRetirer}>
        <X color={colors.texte} size={sizes.icone} />
      </IconButton>
    </View>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.s,
    paddingLeft: spacing.carte,
    paddingRight: spacing.xs,
    paddingVertical: spacing.xs,
    borderRadius: radius.petit,
    borderWidth: sizes.bordure,
    borderColor: colors.alerte,
    backgroundColor: colors.carte,
  },
  texte: { flex: 1 },
});

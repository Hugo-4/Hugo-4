import { ChevronRight, MapPin, Star, Trash2 } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { IconButton } from '@/components/IconButton';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import type { Lieu } from '../types';

type Props = {
  lieu: Lieu;
  onModifier: () => void;
  onParDefaut: () => void;
  onSupprimer: () => void;
  enCours: boolean;
};

/** Un lieu : nom, type, ville, mention « Lieu par défaut » ; modifier, définir par défaut, supprimer. */
export function CarteLieu({ lieu, onModifier, onParDefaut, onSupprimer, enCours }: Props) {
  const { t } = useTranslation();
  const type = lieu.type_lieu ? t(`parametres.lieux.types.${lieu.type_lieu}`) : null;
  const details = [type, lieu.ville].filter(Boolean).join(' · ');

  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={[
          t('parametres.lieux.a11yLieu', { nom: lieu.nom, type: details }),
          lieu.par_defaut ? t('parametres.lieux.parDefaut') : null,
        ]
          .filter(Boolean)
          .join(', ')}
        accessibilityHint={t('parametres.lieux.modifier')}
        onPress={onModifier}
        style={({ pressed }) => [styles.ligne, pressed && styles.presse]}>
        <MapPin color={colors.texte2} size={sizes.icone} />
        <View style={styles.texte}>
          <AppText variant="corpsGras">{lieu.nom}</AppText>
          {details ? <AppText variant="secondaire">{details}</AppText> : null}
          {lieu.par_defaut ? (
            <View style={styles.defaut}>
              <Star color={colors.accent} size={sizes.iconePetite} />
              <AppText variant="libelle" color={colors.accent}>
                {t('parametres.lieux.parDefaut')}
              </AppText>
            </View>
          ) : null}
        </View>
        <ChevronRight color={colors.discret} size={sizes.icone} />
      </Pressable>
      <View style={styles.actions}>
        {!lieu.par_defaut ? (
          <Button label={t('parametres.lieux.definirParDefaut')} variant="discret" disabled={enCours} onPress={onParDefaut} />
        ) : (
          <View />
        )}
        <IconButton accessibilityLabel={`${t('parametres.lieux.supprimer')} : ${lieu.nom}`} onPress={onSupprimer}>
          <Trash2 color={colors.texte2} size={sizes.icone} />
        </IconButton>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.pasAPas },
  texte: { flex: 1, gap: spacing.xxs },
  defaut: { flexDirection: 'row', alignItems: 'center', gap: spacing.xs },
  actions: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  presse: { opacity: opacity.presse },
});

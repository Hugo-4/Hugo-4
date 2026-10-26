import { Check, ChevronRight, EyeOff } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { formatDateCourte } from '@/lib/format';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import type { Souvenir } from '../types';

/** Un élément retenu : texte, état (confirmé, désactivé : toujours écrit, jamais la couleur seule), exercice lié. */
export function LigneSouvenir({ souvenir, onOuvrir }: { souvenir: Souvenir; onOuvrir: () => void }) {
  const { t } = useTranslation();
  const etats = [
    souvenir.confirme ? t('parametres.memoire.confirme') : null,
    !souvenir.actif ? t('parametres.memoire.desactive') : null,
  ].filter(Boolean);
  const details = [
    souvenir.exercices?.nom,
    souvenir.date_observation ? formatDateCourte(souvenir.date_observation.slice(0, 10)) : null,
  ].filter(Boolean);

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={t('parametres.memoire.a11ySouvenir', { contenu: souvenir.contenu, etat: [...etats, ...details].join(', ') })}
      accessibilityHint={t('parametres.memoire.modifier')}
      onPress={onOuvrir}
      style={({ pressed }) => [styles.ligne, pressed && styles.presse]}>
      <View style={styles.texte}>
        <AppText variant="corps" color={souvenir.actif ? colors.texte : colors.discret}>
          {souvenir.contenu}
        </AppText>
        <View style={styles.meta}>
          {souvenir.confirme ? (
            <View style={styles.etat}>
              <Check color={colors.accent} size={sizes.iconePetite} />
              <AppText variant="libelle" color={colors.texte2}>
                {t('parametres.memoire.confirme')}
              </AppText>
            </View>
          ) : null}
          {!souvenir.actif ? (
            <View style={styles.etat}>
              <EyeOff color={colors.discret} size={sizes.iconePetite} />
              <AppText variant="libelle">{t('parametres.memoire.desactive')}</AppText>
            </View>
          ) : null}
          {details.length ? <AppText variant="libelle">{details.join(' · ')}</AppText> : null}
        </View>
      </View>
      <ChevronRight color={colors.discret} size={sizes.icone} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: sizes.pasAPas,
    padding: spacing.m,
    borderRadius: radius.petit,
    backgroundColor: colors.carte,
  },
  texte: { flex: 1, gap: spacing.xs },
  meta: { flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: spacing.s },
  etat: { flexDirection: 'row', alignItems: 'center', gap: spacing.xxs },
  presse: { opacity: opacity.presse },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ChoixOption } from '@/components/ChoixOption';
import { Interrupteur } from '@/components/Interrupteur';
import { Segmente } from '@/components/Segmente';
import { LONGUEURS, TONS } from '@/features/inscription/constantes';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import { colors, spacing } from '@/theme/tokens';

import { STYLE_DEFAUT } from '../constantes';
import type { ModificationPreferences, Preferences } from '../types';

type Props = {
  preferences: Preferences;
  onModifier: (m: ModificationPreferences) => void;
};

/** Style de coaching : ton, longueur des réponses, tutoiement, émojis (textes rédigés par le serveur). */
export function SectionStyle({ preferences, onModifier }: Props) {
  const { t } = useTranslation();
  const style = { ...STYLE_DEFAUT, ...preferences.style_coaching };

  return (
    <SectionProfil titre={t('parametres.preferences.style')}>
      <View style={styles.bloc}>
        <AppText variant="corpsGras" color={colors.texte2}>
          {t('parametres.preferences.ton')}
        </AppText>
        <View accessibilityRole="radiogroup" accessibilityLabel={t('parametres.preferences.ton')} style={styles.bloc}>
          {TONS.map((ton) => (
            <ChoixOption
              key={ton}
              titre={t(`inscription.coaching.tons.${ton}.titre`)}
              description={t(`inscription.coaching.tons.${ton}.description`)}
              selectionne={style.ton === ton}
              onPress={() => onModifier({ style_coaching: { ton } })}
            />
          ))}
        </View>
      </View>
      <View style={styles.bloc}>
        <AppText variant="corpsGras" color={colors.texte2}>
          {t('parametres.preferences.longueur')}
        </AppText>
        <Segmente
          accessibilityLabel={t('parametres.preferences.longueur')}
          options={LONGUEURS.map((l) => ({ valeur: l, label: t(`inscription.coaching.longueurs.${l}`) }))}
          valeur={style.longueur}
          onChange={(longueur) => onModifier({ style_coaching: { longueur } })}
        />
      </View>
      <Interrupteur
        libelle={t('parametres.preferences.tutoiement')}
        valeur={style.tutoiement}
        onChange={(tutoiement) => onModifier({ style_coaching: { tutoiement } })}
      />
      <Interrupteur
        libelle={t('parametres.preferences.emojis')}
        valeur={style.emojis}
        onChange={(emojis) => onModifier({ style_coaching: { emojis } })}
      />
    </SectionProfil>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

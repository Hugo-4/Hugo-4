import { ChevronRight } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { libelleReferentiel, texteLocal } from '@/features/inscription/libelles';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import type { SportAthlete } from '../types';
import { SectionProfil } from './SectionProfil';

type Props = {
  sports: SportAthlete[];
  onOuvrir: (id: string) => void;
};

export function CarteSports({ sports, onOuvrir }: Props) {
  const { t } = useTranslation();
  return (
    <SectionProfil titre={t('profil.sports.titre')}>
      {sports.length === 0 ? <AppText variant="secondaire">{t('profil.sports.aucun')}</AppText> : null}
      {sports.map((sport) => {
        const nom = sport.sports ? libelleReferentiel('sports', sport.sports) : '';
        const objectif = sport.objectifs_sport
          ? texteLocal({ fr: sport.objectifs_sport.libelle_fr, en: sport.objectifs_sport.libelle_en })
          : null;
        const details = [
          sport.role === 'principal' ? t('profil.sports.principal') : t('profil.sports.secondaire'),
          sport.niveau ? t(`inscription.niveau.${sport.niveau}.titre`) : null,
          sport.ambition ? t(`inscription.ambition.${sport.ambition}`) : t(`inscription.cadre.${sport.cadre_pratique}`),
          objectif,
        ].filter(Boolean);
        return (
          <Pressable
            key={sport.id}
            accessibilityRole="button"
            accessibilityLabel={`${nom}, ${details.join(', ')}`}
            onPress={() => onOuvrir(sport.id)}
            style={({ pressed }) => [styles.ligne, pressed && styles.presse]}>
            <View style={styles.texte}>
              <AppText variant="corpsGras">{nom}</AppText>
              <AppText variant="secondaire">{details.join(' · ')}</AppText>
            </View>
            <ChevronRight color={colors.discret} size={sizes.icone} />
          </Pressable>
        );
      })}
    </SectionProfil>
  );
}

const styles = StyleSheet.create({
  ligne: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.m,
    minHeight: sizes.cibleTactile,
    padding: spacing.m,
    borderRadius: radius.petit,
    backgroundColor: colors.carte2,
  },
  texte: { flex: 1, gap: spacing.xxs },
  presse: { opacity: opacity.presse },
});

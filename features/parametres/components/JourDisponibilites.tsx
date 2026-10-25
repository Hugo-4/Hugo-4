import { Clock } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { LigneListe } from '@/components/LigneListe';
import { CRENEAUX, type Creneau } from '@/features/inscription/constantes';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Lieu } from '../types';
import type { CreneauEdite } from '../useEditionDisponibilites';

type Props = {
  jour: number;
  lire: (jour: number, creneau: Creneau) => CreneauEdite | undefined;
  lieux: Lieu[];
  onBasculer: (creneau: Creneau) => void;
  onRegler: (creneau: Creneau) => void;
};

/** Un jour : matin / midi / soir à cocher, puis une ligne par créneau actif (durée, lieu) à régler. */
export function JourDisponibilites({ jour, lire, lieux, onBasculer, onRegler }: Props) {
  const { t } = useTranslation();
  const nomJour = t(`inscription.dispos.joursLongs.${jour as 1 | 2 | 3 | 4 | 5 | 6 | 7}`);
  const actifs = CRENEAUX.map((c) => lire(jour, c)).filter((c): c is CreneauEdite => c !== undefined);

  return (
    <View style={styles.jour}>
      <AppText variant="corpsGras" accessibilityRole="header">
        {nomJour}
      </AppText>
      <View style={styles.puces}>
        {CRENEAUX.map((creneau) => (
          <Chip
            key={creneau}
            label={t(`inscription.dispos.creneaux.${creneau}`)}
            accessibilityLabel={t('parametres.disponibilites.a11yCreneau', {
              jour: nomJour,
              creneau: t(`inscription.dispos.creneaux.${creneau}`),
            })}
            selectionne={lire(jour, creneau) !== undefined}
            onPress={() => onBasculer(creneau)}
          />
        ))}
      </View>
      {actifs.map((c) => {
        const lieu = lieux.find((l) => l.id === c.lieu_id);
        const valeurs = { creneau: t(`inscription.dispos.creneaux.${c.creneau}`), duree: c.duree_max_min };
        return (
          <LigneListe
            key={c.creneau}
            icon={<Clock color={colors.texte2} size={sizes.iconePetite} />}
            titre={
              lieu
                ? t('parametres.disponibilites.resumeLieu', { ...valeurs, lieu: lieu.nom })
                : t('parametres.disponibilites.resume', valeurs)
            }
            onPress={() => onRegler(c.creneau)}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  jour: { gap: spacing.s, paddingVertical: spacing.s, borderBottomWidth: sizes.bordure, borderBottomColor: colors.ligne },
  puces: { flexDirection: 'row', gap: spacing.s, flexWrap: 'wrap' },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Feuille } from '@/components/Feuille';
import { spacing } from '@/theme/tokens';

export const RAISONS_PASSER = ['materiel_occupe', 'douleur', 'fatigue', 'manque_de_temps', 'autre'] as const;
export type RaisonPasser = (typeof RAISONS_PASSER)[number];

type Props = {
  visible: boolean;
  onFermer: () => void;
  onRemplacer: () => void;
  onPasser: (raison: RaisonPasser) => void;
  onAjouterSerie: () => void;
};

/** Menu « ⋯ » d'un exercice : Remplacer (coach), Passer (raison en puces), Ajouter une série. */
export function MenuExercice({ visible, onFermer, onRemplacer, onPasser, onAjouterSerie }: Props) {
  const { t } = useTranslation();
  const [raison, setRaison] = useState<RaisonPasser | null>(null);
  const fermer = () => {
    setRaison(null);
    onFermer();
  };

  return (
    <Feuille visible={visible} titre={t('enSeance.menu.titre')} onFermer={fermer}>
      <Button label={t('enSeance.menu.remplacer')} variant="secondaire" onPress={onRemplacer} />
      <Button label={t('enSeance.menu.ajouterSerie')} variant="secondaire" onPress={onAjouterSerie} />
      <View style={styles.groupe}>
        <AppText variant="surTitre">{t('enSeance.menu.passer')}</AppText>
        <View style={styles.puces}>
          {RAISONS_PASSER.map((r) => (
            <Chip
              key={r}
              role="radio"
              label={t(`enSeance.raisons.${r}`)}
              selectionne={raison === r}
              onPress={() => setRaison(r)}
            />
          ))}
        </View>
        <Button
          label={t('enSeance.menu.confirmerPasser')}
          variant="secondaire"
          disabled={!raison}
          onPress={() => {
            if (raison) onPasser(raison);
            setRaison(null);
          }}
        />
      </View>
    </Feuille>
  );
}

const styles = StyleSheet.create({
  groupe: { gap: spacing.m },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

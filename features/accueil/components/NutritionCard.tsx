import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { colors, radius, spacing } from '@/theme/tokens';

import type { Nutrition } from '../types';
import { MacroBarre } from './MacroBarre';

type Props = {
  nutrition: Nutrition;
  onAjouterRepas: () => void;
};

export function NutritionCard({ nutrition, onAjouterRepas }: Props) {
  const { t } = useTranslation();
  const { calories, proteines, glucides, eau } = nutrition;
  return (
    <Card>
      <View style={styles.entete}>
        <AppText variant="surTitre">{t('accueil.nutrition.titre')}</AppText>
        <Button label={t('accueil.nutrition.ajouterRepas')} variant="discret" onPress={onAjouterRepas} />
      </View>
      <AppText variant="chiffre">
        {t('accueil.nutrition.calories', {
          valeur: formatNombre(calories.valeur),
          objectif: formatNombre(calories.objectif),
        })}
      </AppText>
      <View style={styles.macros}>
        <MacroBarre
          libelle={t('accueil.nutrition.proteines')}
          valeur={proteines.valeur / proteines.objectif}
          texte={t('accueil.nutrition.grammes', { valeur: proteines.valeur, objectif: proteines.objectif })}
        />
        <MacroBarre
          libelle={t('accueil.nutrition.glucides')}
          valeur={glucides.valeur / glucides.objectif}
          texte={t('accueil.nutrition.grammes', { valeur: glucides.valeur, objectif: glucides.objectif })}
        />
        <MacroBarre
          libelle={t('accueil.nutrition.eau')}
          valeur={eau.valeur / eau.objectif}
          texte={t('accueil.nutrition.litres', {
            valeur: formatNombre(eau.valeur, 1),
            objectif: formatNombre(eau.objectif, 1),
          })}
        />
      </View>
      {nutrition.frequents.length > 0 ? (
        <View style={styles.frequents}>
          <AppText variant="libelle">{t('accueil.nutrition.souvent')}</AppText>
          <View style={styles.puces}>
            {nutrition.frequents.map((aliment) => (
              <View key={aliment} style={styles.puce}>
                <AppText variant="secondaire">{aliment}</AppText>
              </View>
            ))}
          </View>
        </View>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  macros: { flexDirection: 'row', gap: spacing.m },
  frequents: { gap: spacing.s },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
  puce: {
    backgroundColor: colors.carte2,
    borderRadius: radius.petit,
    paddingHorizontal: spacing.m,
    paddingVertical: spacing.s,
  },
});

import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { spacing } from '@/theme/tokens';

import { ouvrirVue } from '../navigation';
import type { Niveaux } from '../types';

/** Qualités sans niveau faute de test : le test conseillé par le serveur, et « Ajouter un résultat ». */
export function QualitesATester({ manquantes }: { manquantes: Niveaux['manquantes'] }) {
  const { t } = useTranslation();
  if (manquantes.length === 0) return null;
  return (
    <Card>
      <AppText variant="surTitre">{t('progres.niveaux.manquantes')}</AppText>
      {manquantes.map((m) => (
        <View key={m.qualite} style={styles.bloc}>
          <AppText variant="corpsGras">{m.libelle}</AppText>
          {m.test_conseille ? (
            <AppText variant="secondaire">{t('progres.niveaux.testConseille', { test: m.test_conseille.nom })}</AppText>
          ) : null}
          <Button
            label={t('progres.tests.ajouter')}
            variant="secondaire"
            onPress={() => ouvrirVue('tests', { ajouter: m.test_conseille?.slug ?? '1' })}
          />
        </View>
      ))}
    </Card>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

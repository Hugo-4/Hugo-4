import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/tokens';

import { ouvrirVue } from '../navigation';
import type { VueEnsemble } from '../useVueEnsemble';
import { CarteCharge } from './CarteCharge';
import { CarteLigues } from './CarteLigues';
import { CarteNiveaux } from './CarteNiveaux';
import { CarteRecord } from './CarteRecord';
import { CarteRegularite } from './CarteRegularite';
import { CarteTests } from './CarteTests';

/**
 * Vue d'ensemble de Progrès (« Est-ce que je progresse ? ») : une carte par sujet, chacune ouvre sa vue.
 * Ligues et défis : seulement à partir de 15 ans ; avant, rien de public n'est affiché.
 */
export function ProgresContenu({ vue }: { vue: VueEnsemble }) {
  const ajouterTest = () => ouvrirVue('tests', { ajouter: '1' });
  return (
    <View style={styles.contenu}>
      <CarteRecord
        records={vue.records.donnees}
        etat={vue.records.etat}
        onReessayer={vue.records.reessayer}
        onPress={() => ouvrirVue('records')}
      />
      <CarteTests
        tests={vue.tests.donnees}
        progressions={vue.tests.progressions}
        etat={vue.tests.etat}
        onReessayer={vue.tests.reessayer}
        onPress={() => ouvrirVue('tests')}
        onAjouter={ajouterTest}
      />
      <CarteNiveaux
        niveaux={vue.niveaux.donnees}
        etat={vue.niveaux.etat}
        onReessayer={vue.niveaux.reessayer}
        onPress={() => ouvrirVue('niveaux')}
        onAjouter={ajouterTest}
      />
      <CarteCharge
        charge={vue.charge.donnees}
        actuelle={vue.charge.actuelle}
        etat={vue.charge.etat}
        onReessayer={vue.charge.reessayer}
        onPress={() => ouvrirVue('charge')}
      />
      <CarteRegularite
        regularite={vue.regularite.donnees}
        etat={vue.regularite.etat}
        onReessayer={vue.regularite.reessayer}
        onPress={() => ouvrirVue('regularite')}
      />
      {vue.classementPublic ? (
        <CarteLigues
          ligues={vue.ligues.donnees}
          etat={vue.ligues.etat}
          onReessayer={vue.ligues.reessayer}
          onPress={() => ouvrirVue('ligues')}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenu: { gap: spacing.entreCartes },
});

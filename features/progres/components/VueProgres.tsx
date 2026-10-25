import { router } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { EnTete } from '@/components/EnTete';
import { Screen } from '@/components/Screen';
import { colors, sizes, spacing } from '@/theme/tokens';

import { estVueProgres } from '../navigation';
import { DetailNiveau } from './DetailNiveau';
import { DetailTest } from './DetailTest';
import { VueCharge } from './VueCharge';
import { VueLigues } from './VueLigues';
import { VueNiveaux } from './VueNiveaux';
import { VueRecords } from './VueRecords';
import { VueRegularite } from './VueRegularite';
import { VueTests } from './VueTests';

/** Paramètres de `/progres/[vue]` : la vue, puis le détail précis éventuel (niveau 3). */
export type ParametresVue = {
  vue?: string;
  type?: string;
  exercice?: string;
  cote?: string;
  qualite?: string;
  /** « 1 » ou le slug d'un test : ouvre « Ajouter un résultat » à l'arrivée. */
  ajouter?: string;
};

/** Aiguillage des vues de Progrès (tendance → détail selon les paramètres). */
export function VueProgres({ parametres }: { parametres: ParametresVue }) {
  const { t } = useTranslation();
  const { vue, type, exercice, cote, qualite, ajouter } = parametres;
  if (!estVueProgres(vue)) {
    return (
      <Screen>
        <EnTete titre={t('progres.titre')} />
        <View style={styles.inconnue}>
          <EmptyState
            icon={<SearchX color={colors.discret} size={sizes.icone * 2} />}
            titre={t('progres.etats.vueInconnueTitre')}
            texte={t('progres.etats.vueInconnueTexte')}
          />
          <Button label={t('commun.retour')} variant="secondaire" onPress={() => router.back()} />
        </View>
      </Screen>
    );
  }
  switch (vue) {
    case 'tests':
      return type ? <DetailTest filtre={{ type, exercice, cote }} /> : <VueTests ajouter={ajouter} />;
    case 'niveaux':
      return qualite ? <DetailNiveau qualite={qualite} /> : <VueNiveaux />;
    case 'charge':
      return <VueCharge />;
    case 'records':
      return <VueRecords />;
    case 'regularite':
      return <VueRegularite />;
    case 'ligues':
      return <VueLigues />;
  }
}

const styles = StyleSheet.create({
  inconnue: { flex: 1, padding: spacing.ecran, gap: spacing.l },
});

import { router } from 'expo-router';
import { History } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { EcranProgramme } from '../useEcranProgramme';
import { CalendrierCarte } from './CalendrierCarte';
import { CompetitionsAVenir } from './CompetitionsAVenir';
import { FeuilleJour } from './FeuilleJour';
import { FriseBlocs } from './FriseBlocs';
import { LegendeFeuille } from './LegendeFeuille';
import { ObjectifCard } from './ObjectifCard';
import { StatsMois } from './StatsMois';

/** Onglet Programme, de haut en bas : objectif A, frise des blocs, calendrier du mois, chiffres, compétitions, historique. */
export function ProgrammeContenu({ e }: { e: EcranProgramme }) {
  const { t } = useTranslation();
  const stats = e.calendrier.data?.mois === e.mois ? e.calendrier.data.stats : null;
  const { objectif } = e;
  return (
    <View style={styles.contenu}>
      {objectif ? (
        <ObjectifCard
          evenement={objectif}
          aujourdhui={e.aujourdhui}
          onPress={() => router.push({ pathname: '/programme/evenement/[id]', params: { id: objectif.id } })}
        />
      ) : null}
      <FriseBlocs blocs={e.programme?.blocs ?? []} />
      <CalendrierCarte
        mois={e.mois}
        calendrier={e.calendrier}
        legende={e.legende}
        onMois={e.changerMois}
        onJour={e.ouvrirJour}
        onLegende={e.ouvrirLegende}
      />
      {stats ? <StatsMois stats={stats} /> : null}
      <CompetitionsAVenir competitions={e.competitions} sansObjectifA={!e.objectif} />
      <Button
        label={t('programme.adaptations.lien')}
        variant="discret"
        icon={<History color={colors.accent} size={sizes.icone} />}
        onPress={() => router.push('/programme/adaptations')}
      />
      <FeuilleJour jour={e.jourOuvert} legende={e.legende} onFermer={e.fermerJour} />
      <LegendeFeuille visible={e.legendeOuverte} legende={e.legende} onFermer={e.fermerLegende} />
    </View>
  );
}

const styles = StyleSheet.create({
  contenu: { gap: spacing.entreCartes },
});

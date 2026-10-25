import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { colors, sizes, spacing } from '@/theme/tokens';

import { actionsSeance } from '../presentation';
import type { DetailSeanceProgramme } from '../types';
import type { EcranSeance } from '../useEcranSeance';
import { ActionsSeance } from './ActionsSeance';
import { ExercicesSeance } from './ExercicesSeance';
import { FeuilleDeplacer } from './FeuilleDeplacer';
import { FeuilleManquee } from './FeuilleManquee';
import { RealisationCarte } from './RealisationCarte';
import { SeanceResume } from './SeanceResume';
import { SectionTexte } from './SectionTexte';

type Props = { e: EcranSeance; detail: DetailSeanceProgramme };

/**
 * Détail d'une séance : résumé, actions (si elle est encore à venir), objectif, consignes, réalisé, exercices.
 * [P] « Démarrer » en bas, seulement le jour même.
 */
export function SeanceDetailContenu({ e, detail }: Props) {
  const { t } = useTranslation();
  const actions = actionsSeance(detail);
  const id = detail.seance.id;

  return (
    <View style={styles.flex}>
      <ScrollView
        contentContainerStyle={styles.contenu}
        refreshControl={<RefreshControl refreshing={e.rafraichissement} onRefresh={e.rafraichir} tintColor={colors.accent} />}>
        <SeanceResume detail={detail} legende={e.legende} />
        {actions.modifiable ? (
          <ActionsSeance
            onDeplacer={() => e.ouvrirFeuille('deplacer')}
            onCoach={e.modifierAvecCoach}
            onManquee={() => e.ouvrirFeuille('manquee')}
          />
        ) : null}
        {detail.realisation && actions.faite ? <RealisationCarte realisation={detail.realisation} /> : null}
        <SectionTexte titre={t('programme.seance.objectif')} texte={detail.objectif} />
        <SectionTexte titre={t('programme.seance.consignes')} texte={detail.consignes} />
        <ExercicesSeance detail={detail} onExercice={e.ouvrirExercice} onReessayer={e.reessayer} />
      </ScrollView>
      {actions.demarrable ? (
        <View style={styles.pied}>
          <Button label={t(actions.enCours ? 'programme.seance.reprendre' : 'programme.seance.demarrer')} onPress={e.demarrer} />
        </View>
      ) : null}
      <FeuilleDeplacer
        visible={e.feuille === 'deplacer'}
        programmeSeanceId={id}
        dateActuelle={detail.seance.date}
        onFermer={e.fermerFeuille}
        onDeplacee={e.deplacee}
      />
      <FeuilleManquee visible={e.feuille === 'manquee'} programmeSeanceId={id} onFermer={e.fermerFeuille} onFait={e.manquee} />
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
  pied: { padding: spacing.ecran, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne },
});

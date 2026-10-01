import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { bientot } from '@/lib/bientot';
import { spacing } from '@/theme/tokens';

import type { Accueil } from '../types';
import { AccueilHeader } from './AccueilHeader';
import { CheckinCard } from './CheckinCard';
import { FatigueCard } from './FatigueCard';
import { FormeCard } from './FormeCard';
import { NutritionCard } from './NutritionCard';
import { RecordCard } from './RecordCard';
import { ReposCard } from './ReposCard';
import { SeanceCard } from './SeanceCard';
import { SemaineCard } from './SemaineCard';

type Props = {
  accueil: Accueil;
};

/**
 * Contenu de l'écran Aujourd'hui, dans l'ordre de la fiche (docs/ECRANS.md).
 * Les actions encore non branchées (check-in, séance, adaptations, repas) affichent « Bientôt disponible ».
 */
export function AccueilContent({ accueil }: Props) {
  const { athlete, forme, fatigue, seance, semaine, nutrition, record } = accueil;
  return (
    <View style={styles.contenu}>
      <AccueilHeader
        prenom={athlete.prenom}
        initiales={athlete.initiales}
        notificationsNonLues={athlete.notificationsNonLues}
        onNotifications={bientot}
        onProfil={() => router.navigate('/profil')}
      />
      {forme.checkinFait ? <FormeCard forme={forme} /> : <CheckinCard onCheckin={bientot} />}
      {fatigue ? <FatigueCard fatigue={fatigue} onAccepter={bientot} onRefuser={bientot} /> : null}
      {seance ? (
        <SeanceCard seance={seance} onDemarrer={bientot} onModifier={() => router.navigate('/coach')} />
      ) : (
        <ReposCard prochaineSeance={accueil.prochaineSeance} />
      )}
      {semaine ? <SemaineCard semaine={semaine} onVoirMois={() => router.navigate('/programme')} /> : null}
      {nutrition ? <NutritionCard nutrition={nutrition} onAjouterRepas={bientot} /> : null}
      {record ? <RecordCard texte={record.texte} /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
});

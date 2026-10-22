import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useSession } from '@/features/auth/AuthProvider';
import { useStatutCompte } from '@/features/auth/useStatutCompte';
import { bientot } from '@/lib/bientot';
import { spacing } from '@/theme/tokens';

import type { Accueil, CheckinDuJour } from '../types';
import { AccueilHeader } from './AccueilHeader';
import { CheckinCard } from './CheckinCard';
import { EvenementCard } from './EvenementCard';
import { FatigueCard } from './FatigueCard';
import { FormeCard } from './FormeCard';
import { NutritionCard } from './NutritionCard';
import { ReposCard } from './ReposCard';
import { SeanceCard } from './SeanceCard';
import { SemaineCard } from './SemaineCard';

type Props = {
  accueil: Accueil;
  checkin: CheckinDuJour | null;
};

/**
 * Écran Aujourd'hui, dans l'ordre de la fiche (docs/ECRANS.md), avec les données du serveur.
 * « Démarrer la séance » et les notifications arrivent aux étapes suivantes.
 */
export function AccueilContent({ accueil, checkin }: Props) {
  const { session } = useSession();
  const statut = useStatutCompte(session?.user.id);
  const ouvrirCheckin = () => router.push('/checkin');
  const { aujourdhui, demain } = accueil;

  return (
    <View style={styles.contenu}>
      <AccueilHeader
        prenom={statut.data?.prenom ?? null}
        onNotifications={bientot}
        onProfil={() => router.navigate('/profil')}
      />
      {checkin ? <FormeCard checkin={checkin} onRefaire={ouvrirCheckin} /> : <CheckinCard onCheckin={ouvrirCheckin} />}
      {accueil.adaptation_proposee ? <FatigueCard adaptation={accueil.adaptation_proposee} /> : null}
      {aujourdhui.repos ? (
        <ReposCard prochaine={demain.seances[0] ?? null} />
      ) : (
        aujourdhui.seances.map((seance) => (
          <SeanceCard
            key={seance.id}
            seance={seance}
            bloc={accueil.bloc}
            onDemarrer={bientot}
            onModifier={() => router.navigate('/coach')}
          />
        ))
      )}
      {accueil.prochain_evenement ? <EvenementCard evenement={accueil.prochain_evenement} /> : null}
      <SemaineCard semaine={accueil.semaine} onVoirMois={() => router.navigate('/programme')} />
      <NutritionCard />
    </View>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
});

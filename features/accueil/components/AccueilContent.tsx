import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { useSession } from '@/features/auth/AuthProvider';
import { useStatutCompte } from '@/features/auth/useStatutCompte';
import { ouvrirCoach } from '@/features/coach/ouvrirCoach';
import { useSeanceEnCours } from '@/features/seance/useSeanceEnCours';
import { spacing } from '@/theme/tokens';

import { libelleType } from '../presentation';
import { premiereSemaineAVenir, prochaineSeance } from '../semaineProgramme';
import type { Accueil, CheckinDuJour } from '../types';
import { useOuvrirEvenement } from '../useOuvrirEvenement';
import { useProgrammeActif } from '../useProgrammeActif';
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

/** Écran Aujourd'hui, dans l'ordre de la fiche (docs/ECRANS.md, FRONTEND.md §4.1), avec les données du serveur. */
export function AccueilContent({ accueil, checkin }: Props) {
  const { session } = useSession();
  const statut = useStatutCompte(session?.user.id);
  const enCours = useSeanceEnCours();
  const { aujourdhui, demain } = accueil;
  // Le programme n'est lu que si la semaine en cours est vide ou si rien n'est prévu demain un jour de repos.
  const besoinProgramme = accueil.semaine.stats.prevues === 0 || (aujourdhui.repos && demain.seances.length === 0);
  const programme = useProgrammeActif(besoinProgramme);
  const suivante = prochaineSeance(programme.data, accueil.date);
  const prochaine = demain.seances[0]
    ? { titre: demain.seances[0].titre, date: demain.seances[0].date }
    : suivante
      ? { titre: suivante.focus ?? libelleType({ code: suivante.type_seance, libelle: suivante.type_seance }), date: suivante.date_prevue }
      : null;
  const ouvrirCheckin = () => router.push('/checkin');
  const ouvrirEvenement = useOuvrirEvenement();

  return (
    <View style={styles.contenu}>
      <AccueilHeader
        prenom={statut.data?.prenom ?? null}
        nonLues={0}
        onNotifications={() => router.push('/notifications')}
        onProfil={() => router.navigate('/profil')}
      />
      {checkin ? <FormeCard checkin={checkin} onRefaire={ouvrirCheckin} /> : <CheckinCard onCheckin={ouvrirCheckin} />}
      {accueil.adaptation_proposee ? <FatigueCard adaptation={accueil.adaptation_proposee} /> : null}
      {aujourdhui.repos ? (
        <ReposCard prochaine={prochaine} onVoirProchaine={() => router.navigate('/programme')} />
      ) : (
        aujourdhui.seances.map((seance) => (
          <SeanceCard
            key={seance.id}
            seance={seance}
            bloc={accueil.bloc}
            enCours={enCours.data?.programmeSeanceId === seance.id}
            onDemarrer={() => router.push(`/seance/${seance.id}`)}
            onModifier={() => ouvrirCoach({ type: 'seance', programmeSeanceId: seance.id, titre: seance.titre })}
            onOuvrir={() => router.push({ pathname: '/programme/seance/[id]', params: { id: seance.id } })}
          />
        ))
      )}
      {accueil.prochain_evenement ? <EvenementCard
          evenement={accueil.prochain_evenement}
          aujourdhui={accueil.date}
          onPress={() => accueil.prochain_evenement && ouvrirEvenement(accueil.prochain_evenement)}
        /> : null}
      <SemaineCard
        semaine={accueil.semaine}
        aVenir={premiereSemaineAVenir(programme.data, accueil.date)}
        onVoirMois={() => router.navigate('/programme')}
      />
      <NutritionCard />
    </View>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
});

import { router } from 'expo-router';
import { StyleSheet, View } from 'react-native';

import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { useSession } from '@/features/auth/AuthProvider';
import { useStatutCompte } from '@/features/auth/useStatutCompte';
import { ouvrirCoach } from '@/features/coach/ouvrirCoach';
import { useNombreNonLues } from '@/features/notifications/useNombreNonLues';
import { CarteDernierRecord } from '@/features/progres/components/CarteDernierRecord';
import { BandeauFinirInscription } from '@/features/questionnaire/components/BandeauFinirInscription';
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

/** Recommandations du check-in (calculées par la base) qui invitent à alléger la séance. */
const FORME_BASSE = ['alleger', 'recuperation_active', 'repos_complet'];

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
    ? { id: demain.seances[0].id, titre: demain.seances[0].titre, date: demain.seances[0].date }
    : suivante
      ? {
          id: suivante.id,
          titre: suivante.focus ?? libelleType({ code: suivante.type_seance, libelle: suivante.type_seance }),
          date: suivante.date_prevue,
        }
      : null;
  const ouvrirCheckin = () => router.push('/checkin');
  const ouvrirEvenement = useOuvrirEvenement();
  const nonLues = useNombreNonLues();
  const seanceDuJour = aujourdhui.repos ? null : (aujourdhui.seances[0] ?? null);

  return (
    <View style={styles.contenu}>
      <AccueilHeader
        prenom={statut.data?.prenom ?? null}
        nonLues={nonLues}
        onNotifications={() => router.push('/notifications')}
        onProfil={() => router.navigate('/profil')}
      />
      <BandeauHorsLigne />
      <BandeauFinirInscription />
      {checkin ? (
        <FormeCard
          checkin={checkin}
          onRefaire={ouvrirCheckin}
          // Forme basse un jour de séance (et pas déjà une adaptation proposée) : le coach peut alléger la séance.
          onAdapter={
            seanceDuJour && !accueil.adaptation_proposee && FORME_BASSE.includes(checkin.recommandation ?? '')
              ? () => ouvrirCoach({ type: 'seance', programmeSeanceId: seanceDuJour.id, titre: seanceDuJour.titre })
              : undefined
          }
        />
      ) : (
        <CheckinCard onCheckin={ouvrirCheckin} />
      )}
      {accueil.adaptation_proposee ? <FatigueCard adaptation={accueil.adaptation_proposee} /> : null}
      {aujourdhui.repos ? (
        <ReposCard
          prochaine={prochaine}
          onVoirProchaine={() =>
            prochaine && router.push({ pathname: '/programme/seance/[id]', params: { id: prochaine.id } })
          }
        />
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
      {accueil.prochain_evenement ? (
        <EvenementCard
          evenement={accueil.prochain_evenement}
          aujourdhui={accueil.date}
          onPress={() => accueil.prochain_evenement && ouvrirEvenement(accueil.prochain_evenement)}
        />
      ) : null}
      <SemaineCard
        semaine={accueil.semaine}
        aVenir={premiereSemaineAVenir(programme.data, accueil.date)}
        onVoirMois={() => router.navigate('/programme')}
      />
      <NutritionCard />
      <CarteDernierRecord />
    </View>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
});

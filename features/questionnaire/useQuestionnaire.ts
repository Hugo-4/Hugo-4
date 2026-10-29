import { useQuery } from '@tanstack/react-query';

import { useSession } from '@/features/auth/AuthProvider';
import { useConsentementSante } from '@/features/checkin/useConsentementSante';
import { useTests } from '@/features/progres/useTests';

import { blocs, catalogue, questionsVisibles } from './catalogue';
import { ageDepuis, lireDonnees, valeurConnue } from './donnees';
import type { Bloc, Contexte, Question } from './types';

export const CLE_QUESTIONNAIRE = ['questionnaire'] as const;

/**
 * État du questionnaire complet : questions à poser, blocs, valeurs déjà connues et pourcentage rempli.
 * Une question est faite si l'athlète y a répondu ou l'a passée (`questions_posees`), ou si l'information est
 * déjà en base (le coach ne redemande jamais une information donnée). Les tests sont lus par `GET /tests` :
 * si le serveur ne répond pas, les questions de valeurs restent simplement à faire.
 */
export function useQuestionnaire() {
  const { session } = useSession();
  const userId = session?.user.id;
  const consentement = useConsentementSante();
  const consentementSante = consentement.data === true;
  const tests = useTests();
  const donnees = useQuery({
    queryKey: [...CLE_QUESTIONNAIRE, userId, consentementSante],
    enabled: Boolean(userId) && !consentement.isPending,
    queryFn: () => lireDonnees(userId as string, consentementSante),
  });

  const d = donnees.data;
  if (!d) {
    return { donnees, pret: false as const, chargement: donnees.isPending && donnees.fetchStatus !== 'paused' };
  }

  const listeTests = tests.data ?? [];
  // Les conditions d'affichage lisent les valeurs : on les calcule sur tout le catalogue d'abord.
  const contexteBase: Contexte = {
    sport: d.sportProfil?.sport ?? null,
    age: ageDepuis(d.profil?.date_naissance),
    ambition: d.sportProfil?.ambition ?? null,
    consentementSante,
    valeurs: {},
  };
  const valeurs = Object.fromEntries(catalogue(contexteBase).map((q) => [q.id, valeurConnue(q, d, listeTests)]));
  const contexte: Contexte = { ...contexteBase, valeurs };
  const questions = questionsVisibles(contexte);
  const estFaite = (q: Question) =>
    valeurs[q.id] !== undefined || d.posees[q.id] === 'repondue' || d.posees[q.id] === 'passee';
  const listeBlocs: Bloc[] = blocs(questions, estFaite);
  const faites = questions.filter(estFaite).length;

  return {
    donnees,
    pret: true as const,
    chargement: false,
    contexte,
    questions,
    blocs: listeBlocs,
    estFaite,
    sportProfilId: d.sportProfil?.id ?? null,
    pourcentage: questions.length ? Math.round((faites / questions.length) * 100) : 100,
    reste: questions.length - faites,
  };
}

export type EtatQuestionnaire = Extract<ReturnType<typeof useQuestionnaire>, { pret: true }>;

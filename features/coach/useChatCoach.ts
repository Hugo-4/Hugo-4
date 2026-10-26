import { router, useLocalSearchParams } from 'expo-router';

import { useConsentementSante } from '@/features/checkin/useConsentementSante';

import { versContexteMessage } from './contexte';
import { lireContexte } from './ouvrirCoach';
import { reponsesRapidesVisibles } from './reponsesRapides';
import { useConversation } from './useConversation';
import { useCredits } from './useCredits';
import { useEnvoyerMessage } from './useEnvoyerMessage';

/** Tout ce dont l'écran Coach a besoin : contexte, conversation, envoi, crédits, réponses rapides. */
export function useChatCoach() {
  const params = useLocalSearchParams<{ contexte?: string }>();
  const contexte = lireContexte(params.contexte);
  const conversation = useConversation();
  const credits = useCredits();
  const consentement = useConsentementSante();
  const envoi = useEnvoyerMessage(conversation.data?.id ?? null, versContexteMessage(contexte));

  const messages = conversation.data?.messages ?? [];
  const dernierCoach = messages.filter((m) => m.role === 'coach').at(-1);
  // Hors ligne au premier affichage : la requête attend le réseau, il n'y a rien en cache à montrer.
  const horsLigneSansDonnees = conversation.fetchStatus === 'paused' && !conversation.data;

  return {
    contexte,
    retirerContexte: () => router.setParams({ contexte: undefined }),
    retour: () => (router.canGoBack() ? router.back() : router.navigate('/')),
    conversation,
    horsLigneSansDonnees,
    messages,
    vide: messages.length === 0 && envoi.enAttente.length === 0 && !envoi.enCours,
    urgence: dernierCoach?.urgence === true,
    credits: credits.data,
    reponsesRapides: reponsesRapidesVisibles(consentement.data === true),
    ...envoi,
  };
}

export type ChatCoach = ReturnType<typeof useChatCoach>;

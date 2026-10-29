import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

import { useSession } from '@/features/auth/AuthProvider';
import { nouvelIdentifiant } from '@/features/seance/fileEnvoi';
import { ApiError } from '@/lib/api';

import { ajouterEchange, cleConversation, cleCredits } from './cles';
import { source } from './source';
import type {
  CodeReponseRapide,
  ContexteMessage,
  ConversationCoach,
  DemandeMessage,
  MessageEnAttente,
  ReponseMessage,
} from './types';

type Envoi = { texte: string; reponseRapide?: CodeReponseRapide | null };

/**
 * Envoi d'un message au coach. Le message de l'athlète s'affiche tout de suite (« Envoi… ») ; en cas d'échec
 * il reste dans la conversation, marqué « Non envoyé », avec « Réessayer » (même `id_client` : le serveur
 * ignore un doublon). Un seul envoi à la fois : le coach répond dans l'ordre.
 */
export function useEnvoyerMessage(conversationId: string | null, contexte: ContexteMessage | null) {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const userId = session?.user.id;
  const [enAttente, setEnAttente] = useState<MessageEnAttente[]>([]);
  /** Texte déjà rédigé par le coach, si la source répond au fil de l'eau. */
  const [fragment, setFragment] = useState<string | null>(null);

  const marquer = (id: string, etat: MessageEnAttente['etat'] | null, demande?: DemandeMessage) =>
    setEnAttente((liste) => {
      const autres = liste.filter((m) => m.demande.id_client !== id);
      if (!etat) return autres;
      const actuel = liste.find((m) => m.demande.id_client === id);
      const message = demande ?? actuel?.demande;
      return message ? [...autres, { demande: message, etat }] : autres;
    });

  const mutation = useMutation({
    // Hors ligne, l'envoi échoue tout de suite (au lieu d'attendre en silence) : « Non envoyé » + Réessayer.
    networkMode: 'always',
    mutationFn: (demande: DemandeMessage) => source.envoyerMessage(demande, setFragment),
    onMutate: (demande) => marquer(demande.id_client, 'en_cours', demande),
    onSuccess: (reponse: ReponseMessage, demande) => {
      queryClient.setQueryData<ConversationCoach>(cleConversation(userId), (actuelle) =>
        ajouterEchange(actuelle, reponse.conversation_id, [reponse.message_athlete, reponse.message]),
      );
      queryClient.setQueryData(cleCredits(userId), reponse.credits);
      marquer(demande.id_client, null);
    },
    onError: (erreur, demande) => {
      marquer(demande.id_client, 'echec');
      // 402 : crédits épuisés, le solde affiché doit le refléter (explication + abonnement).
      if (erreur instanceof ApiError && erreur.status === 402) {
        queryClient.invalidateQueries({ queryKey: cleCredits(userId) });
      }
    },
    onSettled: () => {
      setFragment(null);
      // Sur l'objectif, le coach a pu proposer des étapes : Programme les affiche aussitôt.
      if (contexte && 'sujet' in contexte) queryClient.invalidateQueries({ queryKey: ['objectifs'] });
      queryClient.invalidateQueries({ queryKey: cleConversation(userId) });
      queryClient.invalidateQueries({ queryKey: cleCredits(userId) });
    },
  });

  const envoyer = ({ texte, reponseRapide = null }: Envoi) => {
    const propre = texte.trim();
    if (!propre || mutation.isPending) return false;
    mutation.mutate({
      id_client: nouvelIdentifiant(),
      texte: propre,
      conversation_id: conversationId,
      contexte,
      reponse_rapide: reponseRapide,
    });
    return true;
  };

  const reessayer = (idClient: string) => {
    const message = enAttente.find((m) => m.demande.id_client === idClient);
    if (!message || mutation.isPending) return;
    mutation.mutate({ ...message.demande, conversation_id: conversationId ?? message.demande.conversation_id });
  };

  return { envoyer, reessayer, enAttente, fragment, enCours: mutation.isPending };
}

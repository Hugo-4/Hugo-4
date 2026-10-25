import type { ConversationCoach, MessageConversation, PropositionCoach } from './types';

/** Clés TanStack Query du Coach (avec l'athlète, pour ne jamais mélanger deux comptes). */
export const cleConversation = (userId: string | undefined) => ['coach', 'conversation', userId] as const;
export const cleCredits = (userId: string | undefined) => ['coach', 'credits', userId] as const;

/** Données que les propositions du coach peuvent modifier (FRONTEND.md §6 : invalider après une action). */
export const CLES_MODIFIEES_PAR_PROPOSITION = [['accueil'], ['programme']] as const;

/** Ajoute l'échange confirmé par le serveur à la conversation en cache (sans doublon). */
export function ajouterEchange(
  conversation: ConversationCoach | undefined,
  conversationId: string,
  nouveaux: MessageConversation[],
): ConversationCoach {
  const ids = new Set(nouveaux.map((m) => m.id));
  const anciens = (conversation?.messages ?? []).filter((m) => !ids.has(m.id));
  return { id: conversationId, messages: [...anciens, ...nouveaux] };
}

/** Remplace une proposition (nouvel état renvoyé par le serveur) dans la conversation en cache. */
export function remplacerProposition(
  conversation: ConversationCoach | undefined,
  proposition: PropositionCoach,
): ConversationCoach | undefined {
  if (!conversation) return conversation;
  return {
    ...conversation,
    messages: conversation.messages.map((m) => (m.proposition?.id === proposition.id ? { ...m, proposition } : m)),
  };
}

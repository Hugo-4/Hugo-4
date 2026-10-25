import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

import { versMessage } from './lignesMessages';
import type { SourceCoach } from './source';
import type { ConversationCoach, CreditsCoach, ReponseMessage, ReponseProposition } from './types';

/** Canal des conversations du coach (le chat « savoir » du serveur utilise `savoir`). */
export const CANAL_COACH = 'coach';

/** Nombre de messages relus (les plus récents). */
const HISTORIQUE = 200;

/**
 * Implémentation réelle, prête pour les routes de docs/manques/coach.md.
 * Lectures simples en direct avec Supabase (RLS : l'athlète ne lit et ne note que ses lignes) ;
 * tout le reste passe par le serveur, avec le jeton (jamais de userId dans un corps de requête).
 */
export const sourceReelle: SourceCoach = {
  async lireConversation(userId: string): Promise<ConversationCoach> {
    const conversation = await supabase
      .from('conversations_coach')
      .select('id')
      .eq('user_id', userId)
      .eq('canal', CANAL_COACH)
      .eq('statut', 'ouverte')
      .order('dernier_message_le', { ascending: false, nullsFirst: false })
      .limit(1)
      .maybeSingle();
    if (conversation.error) throw conversation.error;
    if (!conversation.data) return { id: null, messages: [] };

    const lignes = await supabase
      .from('messages_coach')
      .select('id, role, contenu, avis, actions, created_at')
      .eq('conversation_id', conversation.data.id)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(HISTORIQUE);
    if (lignes.error) throw lignes.error;
    const messages = lignes.data.flatMap((ligne) => {
      const message = versMessage(ligne);
      return message ? [message] : [];
    });
    return { id: conversation.data.id, messages: messages.reverse() };
  },

  envoyerMessage({ id_client, ...corps }) {
    // La réponse du superviseur peut prendre du temps (experts, médecin, synthèse).
    return api.post<ReponseMessage>('/coach/messages', corps, {
      entetes: { 'Idempotency-Key': id_client },
      delaiMs: 120_000,
    });
  },

  async donnerAvis(userId, messageId, avis) {
    const { error } = await supabase
      .from('messages_coach')
      .update({ avis })
      .eq('id', messageId)
      .eq('user_id', userId)
      .eq('role', 'coach');
    if (error) throw error;
  },

  appliquer: (id) => api.post<ReponseProposition>(`/coach/propositions/${id}/appliquer`, undefined, { delaiMs: 30_000 }),
  garder: (id) => api.post<ReponseProposition>(`/coach/propositions/${id}/garder`),
  annuler: (id) => api.post<ReponseProposition>(`/coach/propositions/${id}/annuler`, undefined, { delaiMs: 30_000 }),
  lireCredits: () => api.get<CreditsCoach>('/coach/credits'),
};

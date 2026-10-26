import { sourceFictive } from './sourceFictive';
import { sourceReelle } from './sourceReelle';
import type {
  Avis,
  ConversationCoach,
  CreditsCoach,
  DemandeMessage,
  ReponseMessage,
  ReponseProposition,
} from './types';

/**
 * Accès aux données du Coach. Aucune route de chat protégée par le jeton n'existe encore côté serveur
 * (le superviseur n'est joignable que par `POST /api/agent/ask`, interdit à l'app) : tant que les routes de
 * docs/MANQUES-SERVEUR.md §3 ne sont pas en ligne, le Coach tourne sur une source fictive au même format.
 * Passer `COACH_FICTIF` à false quand elles le sont.
 */
export const COACH_FICTIF = true;

export type SourceCoach = {
  /** Conversation ouverte la plus récente du canal coach, messages du plus ancien au plus récent. */
  lireConversation: (userId: string) => Promise<ConversationCoach>;
  /**
   * Envoie un message et renvoie la réponse complète du coach. `surFragment` reçoit le texte déjà rédigé
   * si la source sait répondre au fil de l'eau (sinon l'écran affiche « Le coach réfléchit… »).
   */
  envoyerMessage: (demande: DemandeMessage, surFragment?: (texte: string) => void) => Promise<ReponseMessage>;
  donnerAvis: (userId: string, messageId: string, avis: Avis) => Promise<void>;
  appliquer: (propositionId: string) => Promise<ReponseProposition>;
  garder: (propositionId: string) => Promise<ReponseProposition>;
  /** Annule une proposition appliquée, tant que la fenêtre de 10 s n'est pas fermée. */
  annuler: (propositionId: string) => Promise<ReponseProposition>;
  lireCredits: () => Promise<CreditsCoach>;
};

export const source: SourceCoach = COACH_FICTIF ? sourceFictive : sourceReelle;

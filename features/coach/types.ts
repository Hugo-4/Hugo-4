/**
 * Données du Coach, au format des routes demandées au serveur (docs/MANQUES-SERVEUR.md §3) et des tables
 * `conversations_coach` / `messages_coach` (lecture directe, protégée par RLS).
 */

export type RoleMessage = 'athlete' | 'coach';

/** Colonne `messages_coach.avis` : 1 (👍), -1 (👎) ou rien. */
export type Avis = 1 | -1 | null;

/**
 * État d'une proposition de modification :
 * `proposee` (attend une réponse), `appliquee` (annulable jusqu'à `annulable_jusqu_au`), `gardee` (original gardé).
 * Après « Annuler », le serveur la remet à `proposee`.
 */
export type StatutProposition = 'proposee' | 'appliquee' | 'gardee';

/** Modification proposée par le coach : textes rédigés par le serveur, l'app les affiche tels quels. */
export type PropositionCoach = {
  id: string;
  titre: string | null;
  avant: string[];
  apres: string[];
  inchange: string[];
  statut: StatutProposition;
  /** Fin de la fenêtre d'annulation (ISO, 10 s après l'application), `null` sinon. */
  annulable_jusqu_au: string | null;
};

export type MessageConversation = {
  id: string;
  role: RoleMessage;
  contenu: string;
  created_at: string;
  avis: Avis;
  proposition: PropositionCoach | null;
  /** Signes d'alerte repérés par le serveur : bandeau « Appelle le 15 ou le 112 ». */
  urgence: boolean;
};

/** Conversation courante (canal « coach ») ; `id` vaut `null` tant que l'athlète n'a rien envoyé. */
export type ConversationCoach = {
  id: string | null;
  messages: MessageConversation[];
};

/** Solde de crédits du mois (`renouvellement_le` au format AAAA-MM-JJ). */
export type CreditsCoach = {
  restant: number;
  total: number;
  renouvellement_le: string;
};

/** Réponses rapides : un code stable pour le serveur, en plus du texte affiché dans la langue de l'app. */
export type CodeReponseRapide = 'duree_30' | 'sans_salle' | 'decaler_demain' | 'douleur' | 'etapes_objectif';

/**
 * Contexte envoyé avec le message : une séance (et un exercice), ou l'objectif principal (`sujet: 'objectif'` :
 * le coach propose des étapes intermédiaires, enregistrées dans `sous_objectifs` au statut « propose »).
 */
export type ContexteMessage =
  | { programme_seance_id: string; exercice_slug?: string }
  | { sujet: 'objectif'; evenement_id?: string };

/** Message à envoyer. `id_client` (généré sur le téléphone) part en `Idempotency-Key`, pas dans le corps. */
export type DemandeMessage = {
  id_client: string;
  texte: string;
  conversation_id: string | null;
  contexte: ContexteMessage | null;
  reponse_rapide: CodeReponseRapide | null;
};

/** Réponse de `POST /coach/messages`. */
export type ReponseMessage = {
  conversation_id: string;
  message_athlete: MessageConversation;
  message: MessageConversation;
  credits: CreditsCoach;
};

/** Réponse de `POST /coach/propositions/:id/appliquer | garder | annuler`. */
export type ReponseProposition = {
  proposition: PropositionCoach;
};

/** Message de l'athlète pas encore confirmé par le serveur (affiché à la suite de la conversation). */
export type MessageEnAttente = {
  demande: DemandeMessage;
  etat: 'en_cours' | 'echec';
};

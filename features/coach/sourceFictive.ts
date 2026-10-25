import { onlineManager } from '@tanstack/react-query';

import { ApiError } from '@/lib/api';
import i18n from '@/lib/i18n';

import { choisirReponse, ERREURS_FICTIVES, type Bilingue, type ReponseFictive } from './fictif/reponsesFictives';
import type { SourceCoach } from './source';
import type { CreditsCoach, MessageConversation, PropositionCoach, ReponseMessage, ReponseProposition } from './types';

/**
 * SOURCE FICTIVE : simule le serveur en mémoire (rien n'est enregistré, tout repart à zéro au redémarrage
 * de l'app). Mêmes formats que la source réelle ; identifiants préfixés « fictif- ».
 * Crédits de départ choisis pour voir la ligne « moins de 20 % » après deux messages.
 */

const PREFIXE = 'fictif-';
const DUREE_ANNULATION_MS = 10_000;

function premierDuMoisSuivant(): string {
  const d = new Date();
  const suivant = new Date(d.getFullYear(), d.getMonth() + 1, 1);
  return `${suivant.getFullYear()}-${String(suivant.getMonth() + 1).padStart(2, '0')}-01`;
}

const memoire = {
  conversationId: null as string | null,
  messages: [] as MessageConversation[],
  credits: { restant: 11, total: 50, renouvellement_le: premierDuMoisSuivant() } as CreditsCoach,
  dejaTraitees: new Map<string, ReponseMessage>(),
  compteur: 0,
};

const attendre = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
const langue = (texte: Bilingue) => (i18n.language === 'en' ? texte.en : texte.fr);
const nouvelId = (type: string) => `${PREFIXE}${type}-${++memoire.compteur}`;

/** Hors ligne, le faux serveur est injoignable comme le vrai (même erreur que `lib/api.ts`). */
function verifierReseau(chemin: string) {
  if (!onlineManager.isOnline()) throw new ApiError(0, `${chemin} : serveur injoignable (fictif)`, 'injoignable');
}

const erreur = (status: number, chemin: string, texte: Bilingue) =>
  new ApiError(status, `${chemin} : ${status} (fictif)`, { erreur: langue(texte) });

function versProposition(reponse: ReponseFictive): PropositionCoach | null {
  const p = reponse.proposition;
  if (!p) return null;
  const choix = (liste: { fr: string[]; en: string[] }) => (i18n.language === 'en' ? liste.en : liste.fr);
  return {
    id: nouvelId('proposition'),
    titre: langue(p.titre),
    avant: choix(p.avant),
    apres: choix(p.apres),
    inchange: choix(p.inchange),
    statut: 'proposee',
    annulable_jusqu_au: null,
  };
}

/** Change une proposition en mémoire si son état le permet, sinon renvoie l'erreur du serveur. */
async function changerProposition(
  id: string,
  action: string,
  changer: (p: PropositionCoach) => PropositionCoach | Bilingue,
): Promise<ReponseProposition> {
  const chemin = `POST /coach/propositions/${id}/${action}`;
  await attendre(500);
  verifierReseau(chemin);
  const actuelle = memoire.messages.find((m) => m.proposition?.id === id)?.proposition;
  if (!actuelle) throw erreur(404, chemin, ERREURS_FICTIVES.introuvable);
  const resultat = changer(actuelle);
  if (!('id' in resultat)) throw erreur(409, chemin, resultat);
  memoire.messages = memoire.messages.map((m) => (m.proposition?.id === id ? { ...m, proposition: resultat } : m));
  return { proposition: resultat };
}

export const sourceFictive: SourceCoach = {
  async lireConversation() {
    await attendre(400);
    return { id: memoire.conversationId, messages: [...memoire.messages] };
  },

  async envoyerMessage(demande, surFragment) {
    const chemin = 'POST /coach/messages';
    await attendre(300);
    verifierReseau(chemin);
    const deja = memoire.dejaTraitees.get(demande.id_client);
    if (deja) return deja;
    if (memoire.credits.restant <= 0) throw erreur(402, chemin, ERREURS_FICTIVES.credits);

    const reponse = choisirReponse(demande);
    const texte = langue(reponse.texte);
    await attendre(900); // « Le coach réfléchit… »
    if (surFragment) {
      const mots = texte.split(' ');
      for (let i = 1; i <= mots.length; i += 1) {
        surFragment(mots.slice(0, i).join(' '));
        await attendre(35);
      }
    }

    memoire.conversationId ??= nouvelId('conversation');
    const maintenant = new Date().toISOString();
    const commun = { created_at: maintenant, avis: null, urgence: false, proposition: null };
    const message_athlete: MessageConversation = { ...commun, id: nouvelId('message'), role: 'athlete', contenu: demande.texte };
    const message: MessageConversation = {
      ...commun,
      id: nouvelId('message'),
      role: 'coach',
      contenu: texte,
      urgence: reponse.urgence === true,
      proposition: versProposition(reponse),
    };
    memoire.messages = [...memoire.messages, message_athlete, message];
    memoire.credits = { ...memoire.credits, restant: memoire.credits.restant - 1 };
    const resultat: ReponseMessage = { conversation_id: memoire.conversationId, message_athlete, message, credits: memoire.credits };
    memoire.dejaTraitees.set(demande.id_client, resultat);
    return resultat;
  },

  async donnerAvis(_userId, messageId, avis) {
    await attendre(200);
    verifierReseau('PATCH messages_coach.avis');
    memoire.messages = memoire.messages.map((m) => (m.id === messageId ? { ...m, avis } : m));
  },

  appliquer: (id) =>
    changerProposition(id, 'appliquer', (p) =>
      p.statut === 'proposee'
        ? { ...p, statut: 'appliquee', annulable_jusqu_au: new Date(Date.now() + DUREE_ANNULATION_MS).toISOString() }
        : ERREURS_FICTIVES.dejaTraitee,
    ),

  garder: (id) =>
    changerProposition(id, 'garder', (p) =>
      p.statut === 'proposee' ? { ...p, statut: 'gardee' } : ERREURS_FICTIVES.dejaTraitee,
    ),

  annuler: (id) =>
    changerProposition(id, 'annuler', (p) =>
      p.statut === 'appliquee' && p.annulable_jusqu_au && Date.now() <= Date.parse(p.annulable_jusqu_au)
        ? { ...p, statut: 'proposee', annulable_jusqu_au: null }
        : ERREURS_FICTIVES.delaiPasse,
    ),

  async lireCredits() {
    await attendre(250);
    return memoire.credits;
  },
};

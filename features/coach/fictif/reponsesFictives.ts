import type { DemandeMessage } from '../types';

/**
 * DONNÉES FICTIVES — elles simulent les réponses du serveur (superviseur) tant que la route
 * `POST /coach/messages` n'existe pas (COACH_FICTIF dans ../source.ts). Ce ne sont PAS des textes de
 * l'interface : le vrai serveur rédige ses réponses lui-même, dans la langue envoyée en `Accept-Language`.
 */

export type Bilingue = { fr: string; en: string };
type ListeBilingue = { fr: string[]; en: string[] };

export type ReponseFictive = {
  texte: Bilingue;
  proposition?: { titre: Bilingue; avant: ListeBilingue; apres: ListeBilingue; inchange: ListeBilingue };
  urgence?: boolean;
};

type CleReponse = 'duree_30' | 'sans_salle' | 'decaler_demain' | 'douleur' | 'urgence' | 'remplacer' | 'defaut';

const REPONSES: Record<CleReponse, ReponseFictive> = {
  urgence: {
    urgence: true,
    texte: {
      fr: "Douleur dans la poitrine, malaise ou essoufflement inhabituel : arrête tout effort maintenant. Si ça ne passe pas en quelques minutes, ou au moindre doute, appelle le 15 ou le 112. On reparlera de ta séance plus tard.",
      en: 'Chest pain, feeling faint or unusual breathlessness: stop all exercise now. If it does not ease within a few minutes, or if in doubt, call 15 or 112. We will talk about your session later.',
    },
  },
  duree_30: {
    texte: {
      fr: "D'accord pour 30 minutes. Je garde les deux exercices clés à la même charge, je retire les fentes et le gainage, et je raccourcis l'échauffement. Voici ce qui change :",
      en: 'Fine for 30 minutes. I keep the two key lifts at the same load, drop the lunges and the plank, and shorten the warm-up. Here is what changes:',
    },
    proposition: {
      titre: { fr: 'Séance du jour raccourcie', en: "Today's session, shortened" },
      avant: { fr: ['60 min · 6 exercices'], en: ['60 min · 6 exercises'] },
      apres: { fr: ['30 min · 4 exercices'], en: ['30 min · 4 exercises'] },
      inchange: {
        fr: ['Squat barre : 4 × 5 à 80 kg', 'Soulevé de terre roumain : 3 × 8 à 70 kg', 'Objectif du jour : force · bas du corps'],
        en: ['Back squat: 4 × 5 at 80 kg', 'Romanian deadlift: 3 × 8 at 70 kg', "Today's goal: lower-body strength"],
      },
    },
  },
  sans_salle: {
    texte: {
      fr: 'Pas de souci, on fait la séance chez toi. Les exercices à la barre deviennent des variantes au poids du corps, plus lentes, pour garder le travail de force :',
      en: 'No problem, we will do it at home. The barbell lifts become slower bodyweight variations, so you still train strength:',
    },
    proposition: {
      titre: { fr: 'Séance à la maison', en: 'Session at home' },
      avant: { fr: ['Salle de sport · barre et haltères', 'Squat barre, soulevé de terre roumain'], en: ['Gym · barbell and dumbbells', 'Back squat, Romanian deadlift'] },
      apres: { fr: ['À la maison · sans matériel', 'Squat bulgare tempo 3-1-1, hip thrust au sol'], en: ['At home · no equipment', 'Bulgarian split squat 3-1-1 tempo, floor hip thrust'] },
      inchange: { fr: ['Durée : 60 min', 'Objectif du jour : force · bas du corps'], en: ['Duration: 60 min', "Today's goal: lower-body strength"] },
    },
  },
  decaler_demain: {
    texte: {
      fr: "C'est noté. Ta journée de demain a de la place : je déplace la séance, rien d'autre ne bouge dans ta semaine.",
      en: 'Got it. Tomorrow has room: I move the session, nothing else changes in your week.',
    },
    proposition: {
      titre: { fr: 'Séance déplacée', en: 'Session moved' },
      avant: { fr: ["Aujourd'hui · Force · bas du corps"], en: ['Today · Lower-body strength'] },
      apres: { fr: ['Demain · Force · bas du corps'], en: ['Tomorrow · Lower-body strength'] },
      inchange: { fr: ['Le contenu de la séance', 'Les autres séances de la semaine'], en: ['The session content', 'The other sessions this week'] },
    },
  },
  douleur: {
    texte: {
      fr: "Je préfère comprendre avant de toucher à ta séance. Où as-tu mal exactement, et à combien sur 10 ? C'est apparu pendant un effort ou petit à petit ?",
      en: 'I would rather understand before changing your session. Where exactly does it hurt, and how much out of 10? Did it start during exercise or gradually?',
    },
  },
  remplacer: {
    texte: {
      fr: 'Je peux remplacer cet exercice par une variante qui travaille les mêmes muscles. Dis-moi ce qui te gêne : matériel occupé, douleur, ou simplement envie de changer ?',
      en: 'I can swap this exercise for a variation that trains the same muscles. What is the issue: equipment taken, pain, or you just want a change?',
    },
  },
  defaut: {
    texte: {
      fr: "Bien reçu. Dis-m'en un peu plus : tu voudrais changer la durée, le lieu, le jour ou un exercice ?",
      en: 'Got it. Tell me a bit more: do you want to change the duration, the place, the day or an exercise?',
    },
  },
};

/** Mots qui déclenchent la réponse d'urgence (le vrai serveur a ses propres garde-fous, plus complets). */
const URGENCE = /poitrine|malaise|essouffl|chest|faint|breathless|short of breath/i;
const MOTS: [CleReponse, RegExp][] = [
  ['duree_30', /\b30\s?min/i],
  ['sans_salle', /salle|gym|maison|home/i],
  ['decaler_demain', /demain|décaler|decaler|tomorrow/i],
  ['douleur', /\bmal\b|douleur|bless|pain|hurt|injur/i],
];

/** Réponse fictive : urgence d'abord, puis réponse rapide, mots-clés, contexte d'exercice, réponse par défaut. */
export function choisirReponse(demande: DemandeMessage): ReponseFictive {
  if (URGENCE.test(demande.texte)) return REPONSES.urgence;
  if (demande.reponse_rapide) return REPONSES[demande.reponse_rapide];
  const trouvee = MOTS.find(([, motif]) => motif.test(demande.texte));
  if (trouvee) return REPONSES[trouvee[0]];
  return demande.contexte?.exercice_slug ? REPONSES.remplacer : REPONSES.defaut;
}

/** Messages d'erreur fictifs, au format `{ erreur }` du serveur. */
export const ERREURS_FICTIVES = {
  credits: { fr: 'Tu as utilisé tous tes crédits du mois.', en: 'You have used all your credits this month.' },
  introuvable: { fr: 'Proposition introuvable.', en: 'Proposal not found.' },
  dejaTraitee: { fr: 'Cette proposition a déjà reçu une réponse.', en: 'This proposal has already been answered.' },
  delaiPasse: { fr: 'Le délai pour annuler est passé.', en: 'The time to undo has passed.' },
} satisfies Record<string, Bilingue>;

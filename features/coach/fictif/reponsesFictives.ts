import type { ActionApp } from '../actionsApp';
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
  actionsApp?: ActionApp[];
};

type CleReponse =
  | 'duree_30'
  | 'fatigue'
  | 'sans_salle'
  | 'decaler_demain'
  | 'douleur'
  | 'etapes_objectif'
  | 'langue_en'
  | 'langue_fr'
  | 'abonnement'
  | 'notifications'
  | 'poids'
  | 'questionnaire'
  | 'urgence'
  | 'remplacer'
  | 'defaut';

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
  fatigue: {
    texte: {
      fr: "Merci de me le dire. Je garde la séance mais je baisse le volume d'environ un tiers et l'intensité d'un cran : tu travailles la technique sans creuser la fatigue.",
      en: 'Thanks for telling me. I keep the session but cut the volume by about a third and lower the intensity a notch: you work on technique without digging deeper into fatigue.',
    },
    proposition: {
      titre: { fr: 'Séance du jour allégée', en: "Today's session, lighter" },
      avant: { fr: ['6 exercices · RPE 8', '4 × 5 au squat'], en: ['6 exercises · RPE 8', '4 × 5 back squat'] },
      apres: { fr: ['4 exercices · RPE 6-7', '3 × 5 au squat, même charge'], en: ['4 exercises · RPE 6-7', '3 × 5 back squat, same load'] },
      inchange: { fr: ['Objectif du jour : force · bas du corps', 'Échauffement complet'], en: ["Today's goal: lower-body strength", 'Full warm-up'] },
    },
  },
  langue_en: {
    texte: {
      fr: "Je peux passer l'app en anglais. Confirme avec le bouton ci-dessous : tu pourras revenir au français dans Profil → Préférences.",
      en: 'I can switch the app to English. Confirm with the button below: you can switch back in Profile → Preferences.',
    },
    actionsApp: [{ type: 'langue', langue: 'en' }],
  },
  langue_fr: {
    texte: {
      fr: "Je peux passer l'app en français. Confirme avec le bouton ci-dessous.",
      en: 'I can switch the app to French. Confirm with the button below.',
    },
    actionsApp: [{ type: 'langue', langue: 'fr' }],
  },
  abonnement: {
    texte: {
      fr: 'Ton abonnement et ton solde de crédits sont dans Profil → Abonnement et crédits. Je te l\'ouvre :',
      en: 'Your plan and credit balance are in Profile → Plan and credits. Here it is:',
    },
    actionsApp: [{ type: 'ouvrir', ecran: 'abonnement' }],
  },
  notifications: {
    texte: {
      fr: 'Les rappels de séance, le check-in du matin et les heures calmes se règlent dans tes préférences :',
      en: 'Session reminders, the morning check-in and quiet hours are set in your preferences:',
    },
    actionsApp: [{ type: 'ouvrir', ecran: 'preferences' }, { type: 'ouvrir', ecran: 'notifications' }],
  },
  poids: {
    texte: {
      fr: 'Ta taille, ton poids et tes mesures sont dans Profil → Mon corps. Ton poids sert au plan nutrition du jour :',
      en: 'Your height, weight and measurements are in Profile → My body. Your weight is used for the daily nutrition plan:',
    },
    actionsApp: [{ type: 'ouvrir', ecran: 'corps' }],
  },
  questionnaire: {
    texte: {
      fr: "Plus j'en sais sur toi, plus tes séances sont précises : tes charges, tes temps, ton historique. Tu peux finir ton questionnaire par petits blocs :",
      en: 'The more I know about you, the more precise your sessions: your loads, times, history. You can finish your questionnaire in small blocks:',
    },
    actionsApp: [{ type: 'ouvrir', ecran: 'questionnaire' }],
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
  etapes_objectif: {
    texte: {
      fr: "Je te propose trois étapes, réparties d'ici ta compétition : chacune est un repère mesurable. Tu les retrouves dans Programme : accepte-les, modifie-les ou refuse-les.",
      en: 'Here are three milestones spread out until your competition, each one measurable. You will find them in Plan: accept, edit or decline them.',
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
/** Questions sur l'app (le vrai serveur les reconnaît lui-même ; ici, quelques mots-clés). */
const MOTS_APP: [CleReponse, RegExp][] = [
  ['langue_en', /anglais|english/i],
  ['langue_fr', /français|francais|french/i],
  ['abonnement', /abonnement|crédit|credit|subscription|plan\b/i],
  ['notifications', /notif|rappel|reminder/i],
  ['poids', /\bpoids\b|taille|weight|height/i],
  ['questionnaire', /questionnaire|inscription|charges? max|1rm|vma/i],
];
const MOTS: [CleReponse, RegExp][] = [
  ['fatigue', /fatigu|crevé|creve|épuisé|epuise|tired|exhausted/i],
  ['duree_30', /\b30\s?min/i],
  ['sans_salle', /salle|gym|maison|home/i],
  ['decaler_demain', /demain|décaler|decaler|tomorrow/i],
  ['douleur', /\bmal\b|douleur|bless|pain|hurt|injur/i],
];

/** Réponse fictive : urgence d'abord, puis réponse rapide, mots-clés, contexte d'exercice, réponse par défaut. */
export function choisirReponse(demande: DemandeMessage): ReponseFictive {
  if (URGENCE.test(demande.texte)) return REPONSES.urgence;
  // « Adapte ma séance à ma forme » : le vrai serveur lit le check-in ; ici, la même séance allégée que « fatigué ».
  if (demande.reponse_rapide === 'forme_du_jour') return REPONSES.fatigue;
  if (demande.reponse_rapide) return REPONSES[demande.reponse_rapide];
  const trouvee = [...MOTS_APP, ...MOTS].find(([, motif]) => motif.test(demande.texte));
  if (trouvee) return REPONSES[trouvee[0]];
  const contexte = demande.contexte;
  if (contexte && 'sujet' in contexte) return REPONSES.etapes_objectif;
  return contexte && 'exercice_slug' in contexte && contexte.exercice_slug ? REPONSES.remplacer : REPONSES.defaut;
}

/** Messages d'erreur fictifs, au format `{ erreur }` du serveur. */
export const ERREURS_FICTIVES = {
  credits: { fr: 'Tu as utilisé tous tes crédits du mois.', en: 'You have used all your credits this month.' },
  introuvable: { fr: 'Proposition introuvable.', en: 'Proposal not found.' },
  dejaTraitee: { fr: 'Cette proposition a déjà reçu une réponse.', en: 'This proposal has already been answered.' },
  delaiPasse: { fr: 'Le délai pour annuler est passé.', en: 'The time to undo has passed.' },
} satisfies Record<string, Bilingue>;

/** Réponse à « Propose-moi des étapes » : la source fictive enregistre aussi les étapes proposées. */
export const REPONSE_ETAPES = REPONSES.etapes_objectif;

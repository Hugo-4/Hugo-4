import { SECTIONS, type Bloc, type Contexte, type Question, type SectionId } from '../types';
import { CORPS, HISTORIQUE, NUTRITION, ORGANISATION, PREFERENCES, SANTE } from './commun';
import { questionsSport } from './sports';
import { questionsValeurs } from './valeurs';

/** Taille maximale d'un bloc (questionnaire : blocs de 3 à 5 questions). */
const TAILLE_MAX_BLOC = 5;

/** Toutes les questions du parcours Complet pour ce sport, dans l'ordre des sections (sans filtre). */
export function catalogue(c: Pick<Contexte, 'sport'>): Question[] {
  const parSection: Record<SectionId, Question[]> = {
    valeurs: questionsValeurs(c.sport),
    sport: questionsSport(c.sport),
    historique: HISTORIQUE,
    corps: CORPS,
    organisation: ORGANISATION,
    sante: SANTE,
    nutrition: NUTRITION,
    preferences: PREFERENCES,
  };
  return SECTIONS.flatMap((s) => parSection[s]);
}

/** Questions à poser : condition d'affichage remplie, santé seulement avec le consentement. */
export function questionsVisibles(c: Contexte): Question[] {
  return catalogue(c).filter((q) => (!q.sante || c.consentementSante) && (!q.si || q.si(c)));
}

/** Découpe une section en blocs équilibrés de 5 questions au plus (6 questions → 3 + 3). */
function decouper(questions: Question[]): Question[][] {
  const nombre = Math.ceil(questions.length / TAILLE_MAX_BLOC);
  const taille = Math.ceil(questions.length / nombre);
  return Array.from({ length: nombre }, (_, i) => questions.slice(i * taille, (i + 1) * taille)).filter((b) => b.length);
}

/** Blocs du questionnaire, avec le nombre de questions déjà traitées dans chacun. */
export function blocs(questions: Question[], estFaite: (q: Question) => boolean): Bloc[] {
  return SECTIONS.flatMap((section) => {
    const morceaux = decouper(questions.filter((q) => q.section === section));
    return morceaux.map((qs, i) => ({
      id: `${section}-${i + 1}`,
      section,
      numero: i + 1,
      totalSection: morceaux.length,
      questions: qs,
      faites: qs.filter(estFaite).length,
    }));
  });
}

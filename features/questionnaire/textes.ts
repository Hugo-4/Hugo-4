import type { TFunction } from 'i18next';

/**
 * Textes du catalogue : les identifiants viennent des données (TC41, MU04…), d'où ces clés construites.
 * Toutes les clés existent dans `locales/<langue>/questionnaire.json` (vérifié à la génération).
 */
const cle = (t: TFunction, chemin: string) => t(chemin as never) as string;

export const texteQuestion = (t: TFunction, id: string) => cle(t, `questionnaire.questions.${id}`);
export const texteOption = (t: TFunction, code: string) => cle(t, `questionnaire.options.${code}`);
export const texteTest = (t: TFunction, libelle: string) => cle(t, `questionnaire.tests.${libelle}`);
export const texteUnite = (t: TFunction, unite: string) => cle(t, `questionnaire.unites.${unite}`);
export const texteSection = (t: TFunction, section: string) => cle(t, `questionnaire.sections.${section}`);
export const texteAideSection = (t: TFunction, section: string) => cle(t, `questionnaire.sectionsAide.${section}`);

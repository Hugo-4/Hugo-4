import type { FormatTest, ReponseTest } from './types';

/** Nombre saisi avec une virgule ou un point ; `null` si vide ou invalide. */
export function lireNombre(texte: string): number | null {
  const n = Number(texte.replace(',', '.').trim());
  return texte.trim() !== '' && Number.isFinite(n) ? n : null;
}

/** Champs d'une valeur de test, tels que saisis. */
export type ChampsTest = {
  valeur: string;
  repetitions: string;
  heures: string;
  minutes: string;
  secondes: string;
  anciennete: ReponseTest['anciennete'] | null;
  methode: ReponseTest['methode'] | null;
};

export const CHAMPS_VIDES: ChampsTest = {
  valeur: '',
  repetitions: '1',
  heures: '',
  minutes: '',
  secondes: '',
  anciennete: null,
  methode: null,
};

/** Valeur numérique du test (secondes pour une durée ou une allure). */
function valeurTest(format: FormatTest, c: ChampsTest): number | null {
  if (format === 'duree' || format === 'allure') {
    const h = format === 'duree' ? (lireNombre(c.heures) ?? 0) : 0;
    const total = h * 3600 + (lireNombre(c.minutes) ?? 0) * 60 + (lireNombre(c.secondes) ?? 0);
    return total > 0 ? total : null;
  }
  const n = lireNombre(c.valeur);
  return n !== null && n > 0 ? n : null;
}

/** Réponse complète, ou `null` tant qu'il manque la valeur, l'ancienneté ou la méthode. */
export function reponseTest(format: FormatTest, c: ChampsTest): ReponseTest | null {
  const valeur = valeurTest(format, c);
  const repetitions = format === 'charge' ? lireNombre(c.repetitions) : 1;
  if (valeur === null || !c.anciennete || !c.methode || repetitions === null || repetitions < 1 || repetitions > 30) return null;
  return { valeur, repetitions: Math.round(repetitions), anciennete: c.anciennete, methode: c.methode };
}

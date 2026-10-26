import { etatsEnsemble, etatSection } from './etats';
import { useClassementPublic } from './useClassementPublic';
import { useChargeSemaines, useLigues, useNiveaux, useRecords, useRegularite } from './useDonneesProgres';
import { useRafraichir } from './useRafraichir';
import { useChargeActuelle, useProgressions } from './useSuiviServeur';
import { useTests } from './useTests';

/**
 * Données de la vue d'ensemble de Progrès : une carte par question (record, tests, niveaux, charge,
 * régularité, ligues), chacune avec son propre état ; l'écran entier n'est en erreur que si tout a échoué.
 */
export function useVueEnsemble() {
  const tests = useTests();
  const progressions = useProgressions();
  const records = useRecords();
  const niveaux = useNiveaux();
  const chargeSemaines = useChargeSemaines();
  const chargeActuelle = useChargeActuelle();
  const regularite = useRegularite();
  const classementPublic = useClassementPublic().autorise;
  const ligues = useLigues(classementPublic);
  const { rafraichir, rafraichissement } = useRafraichir();

  const requetes = [tests, progressions, records, niveaux, chargeSemaines, chargeActuelle, regularite];
  const etats = etatsEnsemble(requetes);

  // Vide : tout est arrivé et rien n'a encore été mesuré (nouvel athlète).
  const vide =
    tests.data?.length === 0 &&
    progressions.data?.length === 0 &&
    records.data?.length === 0 &&
    niveaux.data?.qualites.length === 0 &&
    regularite.data?.semaines_comptees === 0 &&
    chargeSemaines.data?.semaines.every((s) => s.charge === 0) === true;

  return {
    ...etats,
    vide,
    rafraichir,
    rafraichissement,
    classementPublic,
    tests: { donnees: tests.data, progressions: progressions.data ?? [], etat: etatSection(tests), reessayer: tests.refetch },
    records: { donnees: records.data, etat: etatSection(records), reessayer: records.refetch },
    niveaux: { donnees: niveaux.data, etat: etatSection(niveaux), reessayer: niveaux.refetch },
    charge: {
      donnees: chargeSemaines.data,
      actuelle: chargeActuelle.data,
      etat: etatSection(chargeSemaines),
      reessayer: chargeSemaines.refetch,
    },
    regularite: { donnees: regularite.data, etat: etatSection(regularite), reessayer: regularite.refetch },
    ligues: { donnees: ligues.data, etat: etatSection(ligues), reessayer: ligues.refetch },
  };
}

export type VueEnsemble = ReturnType<typeof useVueEnsemble>;

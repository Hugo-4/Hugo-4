import { useState } from 'react';

import type { ValeurDate } from '@/components/DateField';
import { dateDuJour } from '@/features/checkin/dateDuJour';
import { dateIso, estDansLeFutur } from '@/features/inscription/dates';

import { useAjouterTest, useTypesTests } from './useTests';

export type ErreursTest = Partial<Record<'type' | 'valeur' | 'date' | 'exercice', true>>;

function dateDuJourSaisie(): ValeurDate {
  const [annee, mois, jour] = dateDuJour().split('-');
  return { jour, mois, annee };
}

/**
 * Saisie d'un résultat de test (feuille « Ajouter un résultat ») : type, valeur, date, méthode
 * testé / déclaré, exercice si le test en demande un. Envoi : `POST /tests`.
 */
export function useFormulaireTest(typeInitial: string | undefined, onEnregistre: () => void) {
  const types = useTypesTests();
  const ajout = useAjouterTest();
  const [type, setType] = useState<string | null>(typeInitial ?? null);
  const [valeur, setValeur] = useState('');
  const [exercice, setExercice] = useState('');
  const [date, setDate] = useState<ValeurDate>(dateDuJourSaisie);
  const [methode, setMethode] = useState<'teste' | 'declare'>('teste');
  const [notes, setNotes] = useState('');
  const [erreurs, setErreurs] = useState<ErreursTest>({});
  const typeChoisi = types.data?.find((t) => t.slug === type) ?? null;

  const enregistrer = () => {
    const nombre = Number(valeur.trim().replace(',', '.'));
    const iso = dateIso(date);
    const nouvelles: ErreursTest = {
      ...(typeChoisi ? {} : { type: true }),
      ...(Number.isFinite(nombre) && nombre > 0 ? {} : { valeur: true }),
      ...(iso && !estDansLeFutur(iso) ? {} : { date: true }),
      ...(typeChoisi?.par_exercice && !exercice.trim() ? { exercice: true } : {}),
    };
    setErreurs(nouvelles);
    if (Object.keys(nouvelles).length > 0 || !typeChoisi || !iso) return;
    ajout.mutate(
      {
        type: typeChoisi.slug,
        valeur: nombre,
        date_test: iso,
        methode,
        ...(typeChoisi.par_exercice ? { exercice: exercice.trim() } : {}),
        ...(notes.trim() ? { notes: notes.trim() } : {}),
      },
      { onSuccess: onEnregistre },
    );
  };

  return {
    types,
    typeChoisi,
    champs: { type, valeur, exercice, date, methode, notes },
    modifier: { setType, setValeur, setExercice, setDate, setMethode, setNotes },
    erreurs,
    enregistrer,
    envoi: ajout,
  };
}

import { useEffect, useState } from 'react';

import type { Question, ValeurReponse } from './types';
import { type EtatQuestionnaire, useQuestionnaire } from './useQuestionnaire';
import { useRepondre } from './useRepondre';

/**
 * Questions à parcourir pour une cible : un bloc (`valeurs-1`) ou une section entière (`corps`, depuis le Profil).
 * Bloc pas fini : seulement ses questions restantes ; bloc fini ou section : toutes, pour les revoir.
 */
function questionsCible(q: EtatQuestionnaire, cible: string): Question[] | null {
  const bloc = q.blocs.find((b) => b.id === cible);
  if (bloc) {
    const restantes = bloc.questions.filter((x) => !q.estFaite(x));
    return restantes.length ? restantes : bloc.questions;
  }
  const section = q.questions.filter((x) => x.section === cible);
  return section.length ? section : null;
}

/** Parcours question par question : chaque réponse est enregistrée tout de suite, on peut quitter à tout moment. */
export function useParcoursBloc(cible: string) {
  const q = useQuestionnaire();
  const repondre = useRepondre(q.pret ? q.sportProfilId : null);
  // La liste est figée à l'ouverture : une question répondue ne disparaît pas sous les yeux de l'athlète.
  const [ids, setIds] = useState<string[] | null>(null);
  const [index, setIndex] = useState(0);
  const pret = q.pret;

  useEffect(() => {
    if (!q.pret || ids) return;
    const liste = questionsCible(q, cible);
    setIds(liste ? liste.map((x) => x.id) : []);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pret, cible, ids]);

  const visibles = q.pret ? q.questions : [];
  const trouver = (i: number) => (ids && i < ids.length ? visibles.find((x) => x.id === ids[i]) : undefined);
  // Une question devenue sans objet (ex. durée de séance si 0 séance) est sautée.
  let courant = index;
  while (ids && courant < ids.length && !trouver(courant)) courant += 1;
  const question = trouver(courant) ?? null;
  const fini = ids !== null && courant >= ids.length;
  const avancer = () => setIndex(courant + 1);

  const enregistrer = (valeur: ValeurReponse | null) => {
    if (!question) return;
    repondre.mutate({ question, valeur }, { onSuccess: avancer });
  };

  return {
    etat: q,
    pret: q.pret && ids !== null,
    introuvable: ids !== null && ids.length === 0,
    question,
    numero: courant + 1,
    total: ids?.length ?? 0,
    valeurConnue: question && q.pret ? q.contexte.valeurs[question.id] : undefined,
    fini,
    enregistrer,
    envoi: repondre,
    blocSuivant: q.pret ? (q.blocs.find((b) => b.id !== cible && b.faites < b.questions.length) ?? null) : null,
  };
}

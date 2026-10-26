import type { Question, ReponseTest, ValeurReponse } from '../types';
import { SaisieChoix } from './SaisieChoix';
import { SaisieNombre } from './SaisieNombre';
import { SaisieTest } from './SaisieTest';

type Props = {
  question: Question;
  valeur: ValeurReponse | null;
  onChange: (valeur: ValeurReponse | null) => void;
};

/** Saisie adaptée au type de la question (choix, nombre, valeur de test). */
export function SaisieQuestion({ question, valeur, onChange }: Props) {
  switch (question.type) {
    case 'unique':
    case 'multiple':
      return (
        <SaisieChoix
          options={question.options ?? []}
          multiple={question.type === 'multiple'}
          max={question.max}
          valeur={typeof valeur === 'string' || Array.isArray(valeur) ? valeur : null}
          onChange={onChange}
        />
      );
    case 'nombre':
      return question.nombre ? (
        <SaisieNombre bornes={question.nombre} valeur={typeof valeur === 'number' ? valeur : null} onChange={onChange} />
      ) : null;
    case 'test':
      return question.test ? <SaisieTest test={question.test} onChange={(r: ReponseTest | null) => onChange(r)} /> : null;
  }
}

import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { TextField } from '@/components/TextField';

import { lireNombre } from '../saisie';
import { texteUnite } from '../textes';

type Props = {
  bornes: { min: number; max: number; unite: string; decimal?: boolean };
  valeur: number | null;
  onChange: (valeur: number | null) => void;
};

/** Nombre dans des bornes (taille, kilomètres…), virgule ou point acceptés. */
export function SaisieNombre({ bornes, valeur, onChange }: Props) {
  const { t } = useTranslation();
  const [texte, setTexte] = useState(valeur === null ? '' : String(valeur).replace('.', ','));
  const nombre = lireNombre(texte);
  const horsBornes = nombre !== null && (nombre < bornes.min || nombre > bornes.max);

  return (
    <TextField
      label={texteUnite(t, bornes.unite)}
      value={texte}
      onChangeText={(nouveau) => {
        setTexte(nouveau);
        const n = lireNombre(nouveau);
        onChange(n !== null && n >= bornes.min && n <= bornes.max ? n : null);
      }}
      keyboardType={bornes.decimal ? 'decimal-pad' : 'number-pad'}
      erreur={horsBornes ? t('questionnaire.question.nombreHorsBornes', { min: bornes.min, max: bornes.max }) : undefined}
    />
  );
}

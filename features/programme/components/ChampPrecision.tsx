import { useTranslation } from 'react-i18next';

import { TextField } from '@/components/TextField';

import { POIDS_MAX_KG, POIDS_MIN_KG, type Precision } from '../constantes';

type Props = {
  precision: Precision | null;
  valeur: string;
  onChange: (valeur: string) => void;
  erreur?: boolean;
};

/** Précision selon le sport : distance (endurance), catégorie de poids (combat) ou poste (sports collectifs). */
export function ChampPrecision({ precision, valeur, onChange, erreur }: Props) {
  const { t } = useTranslation();
  if (!precision) return null;
  return (
    <TextField
      label={t(`programme.evenement.precision.${precision}`)}
      aide={t(`programme.evenement.precisionAide.${precision}`)}
      value={valeur}
      onChangeText={onChange}
      keyboardType={precision === 'categorie_poids' ? 'decimal-pad' : 'default'}
      erreur={erreur ? t('programme.evenement.erreurs.poids', { min: POIDS_MIN_KG, max: POIDS_MAX_KG }) : undefined}
    />
  );
}

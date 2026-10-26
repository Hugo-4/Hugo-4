import type { TFunction } from 'i18next';

import { formatNombre } from '@/lib/format';
import { texteUnite } from '@/features/questionnaire/textes';

import { ecrireDuree } from './saisie';

/** Valeur d'un indicateur avec son unité : durée (h:min:s) pour les temps et allures, nombre sinon. */
export function formatValeurEtape(t: TFunction, valeur: number, unite: string | null): string {
  if (unite === 's' || unite === 'parKm') {
    const duree = ecrireDuree(valeur);
    return unite === 'parKm' ? `${duree} ${texteUnite(t, 'parKm')}` : duree;
  }
  const nombre = formatNombre(valeur, Number.isInteger(valeur) ? 0 : 1);
  return unite ? `${nombre} ${texteUnite(t, unite)}` : nombre;
}

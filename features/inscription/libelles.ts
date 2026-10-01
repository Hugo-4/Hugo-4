import i18n from '@/lib/i18n';

import type { Referentiel } from './useReferentiels';

/**
 * Libellé traduit d'un sport ou d'un objectif à partir de son slug ;
 * à défaut de traduction, le nom enregistré en base.
 */
export function libelleReferentiel(groupe: 'sports' | 'objectifs', item: Referentiel): string {
  const cle = `referentiels.${groupe}.${item.slug}`;
  return i18n.exists(cle) ? String(i18n.t(cle as never)) : item.nom;
}

export function descriptionObjectif(item: Referentiel): string | undefined {
  const cle = `referentiels.objectifsDescription.${item.slug}`;
  return i18n.exists(cle) ? String(i18n.t(cle as never)) : undefined;
}

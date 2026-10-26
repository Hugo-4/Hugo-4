import { sizes, spacing } from '@/theme/tokens';

/** Zone tactile minimale de FRONTEND.md §5.3 (48), calculée depuis les jetons comme `Button`. */
export const CIBLE = sizes.cibleTactile + spacing.xs;

/** Hauteur visible d'une puce de réponse rapide (40) ; la zone tactile est complétée par `MARGE_TACTILE`. */
export const HAUTEUR_PUCE = sizes.cibleTactile - spacing.xs;
export const MARGE_TACTILE = (CIBLE - HAUTEUR_PUCE) / 2;

/** Largeur maximale d'une bulle de message. */
export const LARGEUR_BULLE = '85%';

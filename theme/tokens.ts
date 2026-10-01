/**
 * Jetons de design Athlenis (mode sombre uniquement).
 * Aucune couleur, taille ou espacement ne doit être écrit en dur ailleurs.
 */

export const colors = {
  fond: '#0B0D0C',
  carte: '#151816',
  carte2: '#1E2220',
  ligne: '#2A2F2C',
  texte: '#F2F4F1',
  texte2: '#C9D0CB',
  discret: '#9AA39E',
  accent: '#C8FF2E',
  surAccent: '#0B0D0C',
  alerte: '#FF8A3D',
} as const;

export const radius = {
  carte: 20,
  bouton: 16,
  petit: 12,
  rond: 999,
} as const;

/** Multiples de 4. */
export const spacing = {
  xxs: 2,
  xs: 4,
  s: 8,
  m: 12,
  carte: 14,
  l: 16,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  /** Bord d'écran. */
  ecran: 16,
  /** Entre deux cartes. */
  entreCartes: 16,
} as const;

export const fonts = {
  titre: 'BarlowCondensed_600SemiBold',
  titreGras: 'BarlowCondensed_700Bold',
  texte: 'Manrope_400Regular',
  texteMoyen: 'Manrope_500Medium',
  texteDemiGras: 'Manrope_600SemiBold',
  texteGras: 'Manrope_700Bold',
} as const;

/** Taille minimale : 12. */
export const fontSizes = {
  xs: 12,
  s: 13,
  m: 15,
  l: 17,
  xl: 22,
  xxl: 28,
  display: 40,
} as const;

export const sizes = {
  /** Cible tactile minimale. */
  cibleTactile: 44,
  icone: 20,
  iconePetite: 16,
  avatar: 44,
  anneauForme: 112,
  epaisseurAnneau: 10,
  pastilleJour: 36,
  boutonCoach: 60,
  /** Décalage vers le haut du bouton Coach dans la barre d'onglets. */
  elevationCoach: 18,
  hauteurBarreOnglets: 60,
  jauge: 8,
  bordure: 1,
  bordureForte: 2,
} as const;

export const opacity = {
  presse: 0.7,
  desactive: 0.4,
} as const;

export const tokens = { colors, radius, spacing, fonts, fontSizes, sizes, opacity };

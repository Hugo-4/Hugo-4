import {
  Activity,
  ArrowUpFromLine,
  BicepsFlexed,
  Dumbbell,
  Flame,
  Leaf,
  type LucideIcon,
  PersonStanding,
  Shuffle,
  Swords,
  Target,
  Timer,
} from 'lucide-react-native';

/**
 * Icône de chaque type de séance (codes `type.code` de tools/presentationSeance.js, TYPES) : le type se lit sur
 * le calendrier sans dépendre d'une couleur. Un code inconnu n'a pas d'icône (le lecteur d'écran lit le type).
 */
export const ICONES_TYPE: Record<string, LucideIcon> = {
  force: Dumbbell,
  hypertrophie: BicepsFlexed,
  endurance: Activity,
  fractionne: Timer,
  hiit: Flame,
  technique: Target,
  recuperation_active: Leaf,
  mobilite: PersonStanding,
  combat_sparring: Swords,
  pliometrie: ArrowUpFromLine,
  mixte: Shuffle,
};

export const iconeType = (code: string | null | undefined): LucideIcon | null => (code && ICONES_TYPE[code]) || null;

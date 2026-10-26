import type { ComponentType } from 'react';

import type { EtapeId } from '../etapes';
import { EtapeAmbition } from './EtapeAmbition';
import { EtapeBesoins } from './EtapeBesoins';
import { EtapeCoaching } from './EtapeCoaching';
import { EtapeCompetition } from './EtapeCompetition';
import { EtapeContraintes } from './EtapeContraintes';
import { EtapeDisponibilites } from './EtapeDisponibilites';
import { EtapeDouleurs } from './EtapeDouleurs';
import { EtapeIdentite } from './EtapeIdentite';
import { EtapeLieu } from './EtapeLieu';
import { EtapeNiveau } from './EtapeNiveau';
import { EtapeObjectifSport } from './EtapeObjectifSport';
import { EtapeObjectifsSecondaires } from './EtapeObjectifsSecondaires';
import { EtapePays } from './EtapePays';
import { EtapePoids } from './EtapePoids';
import { EtapePratique } from './EtapePratique';
import { EtapeProfilPhysique } from './EtapeProfilPhysique';
import { EtapeRecommandation } from './EtapeRecommandation';
import { EtapeSport } from './EtapeSport';
import { EtapeSportsSecondaires } from './EtapeSportsSecondaires';

const COMPOSANTS: Record<EtapeId, ComponentType> = {
  identite: EtapeIdentite,
  pays: EtapePays,
  poids: EtapePoids,
  profilPhysique: EtapeProfilPhysique,
  pratique: EtapePratique,
  sport: EtapeSport,
  ambition: EtapeAmbition,
  objectifSport: EtapeObjectifSport,
  niveau: EtapeNiveau,
  objectifsSecondaires: EtapeObjectifsSecondaires,
  besoins: EtapeBesoins,
  contraintes: EtapeContraintes,
  recommandation: EtapeRecommandation,
  sportsSecondaires: EtapeSportsSecondaires,
  disponibilites: EtapeDisponibilites,
  lieu: EtapeLieu,
  competition: EtapeCompetition,
  douleurs: EtapeDouleurs,
  coaching: EtapeCoaching,
};

export function EtapeCourante({ etape }: { etape: EtapeId }) {
  const Composant = COMPOSANTS[etape];
  return <Composant />;
}

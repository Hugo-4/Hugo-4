import type { ComponentType } from 'react';

import type { EtapeId } from '../etapes';
import { EtapeCadre } from './EtapeCadre';
import { EtapeCoaching } from './EtapeCoaching';
import { EtapeCompetition } from './EtapeCompetition';
import { EtapeDisponibilites } from './EtapeDisponibilites';
import { EtapeDouleurs } from './EtapeDouleurs';
import { EtapeIdentite } from './EtapeIdentite';
import { EtapeLieu } from './EtapeLieu';
import { EtapeNiveau } from './EtapeNiveau';
import { EtapeObjectif } from './EtapeObjectif';
import { EtapePays } from './EtapePays';
import { EtapeProfilPhysique } from './EtapeProfilPhysique';
import { EtapeSport } from './EtapeSport';
import { EtapeSportsSecondaires } from './EtapeSportsSecondaires';

const COMPOSANTS: Record<EtapeId, ComponentType> = {
  identite: EtapeIdentite,
  pays: EtapePays,
  profilPhysique: EtapeProfilPhysique,
  sport: EtapeSport,
  objectif: EtapeObjectif,
  niveau: EtapeNiveau,
  sportsSecondaires: EtapeSportsSecondaires,
  cadre: EtapeCadre,
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

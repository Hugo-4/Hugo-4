import { router } from 'expo-router';
import { useState } from 'react';

import { FormulaireFin } from '@/features/seance/components/FormulaireFin';
import { ResumeFin } from '@/features/seance/components/ResumeFin';
import { type Resume, resumeSeance } from '@/features/seance/resume';
import { useSeance } from '@/features/seance/SeanceProvider';
import { useActionsSeance } from '@/features/seance/useActionsSeance';

/** Fin de séance : ressenti, puis résumé et retour à Aujourd'hui. */
export default function FinSeanceScreen() {
  const { etat } = useSeance();
  const { terminer } = useActionsSeance();
  const [resume, setResume] = useState<Resume | null>(null);
  // Heure d'arrivée sur l'écran de fin : sert à préremplir la durée réelle.
  const [arrivee] = useState(() => Date.now());

  if (resume) {
    return <ResumeFin resume={resume} onTerminer={() => router.dismissTo('/')} />;
  }
  const calcule = resumeSeance(etat, arrivee);
  return (
    <FormulaireFin
      dureeMin={calcule.dureeMin}
      onValider={(retour) => {
        setResume({ ...calcule, dureeMin: retour.duree_reelle_min });
        terminer(retour);
      }}
    />
  );
}

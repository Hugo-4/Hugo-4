import { useEffect, useRef, useState } from 'react';

import { vibrerFinRepos } from './retours';

/** Heure actuelle rafraîchie toutes les `intervalleMs` (chrono, minuteur). */
export function useMaintenant(intervalleMs = 1000): number {
  const [maintenant, setMaintenant] = useState(Date.now());
  useEffect(() => {
    const minuteur = setInterval(() => setMaintenant(Date.now()), intervalleMs);
    return () => clearInterval(minuteur);
  }, [intervalleMs]);
  return maintenant;
}

/** « 18:24 » ou « 1:02:05 ». */
export function formatChrono(secondes: number): string {
  const s = Math.max(0, Math.round(secondes));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const deux = (n: number) => String(n).padStart(2, '0');
  return h ? `${h}:${deux(m)}:${deux(s % 60)}` : `${m}:${deux(s % 60)}`;
}

const RETARD_MAX_VIBRATION_MS = 3000;

/**
 * Secondes restantes du repos. L'heure de fin est enregistrée : le minuteur reste juste
 * si l'app passe en arrière-plan (la notification locale prévient alors). Vibration forte une seule fois à la fin.
 */
export function useRepos(fin: number | null, onFini: () => void): number | null {
  const maintenant = useMaintenant(250);
  const vibre = useRef<number | null>(null);
  const restant = fin === null ? null : Math.ceil((fin - maintenant) / 1000);

  useEffect(() => {
    if (fin !== null && restant !== null && restant <= 0 && vibre.current !== fin) {
      vibre.current = fin;
      // Repos fini pendant que l'app était en arrière-plan : la notification a déjà prévenu.
      if (Date.now() - fin < RETARD_MAX_VIBRATION_MS) vibrerFinRepos();
      onFini();
    }
  }, [fin, restant, onFini]);

  return restant === null ? null : Math.max(0, restant);
}

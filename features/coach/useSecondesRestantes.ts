import { useEffect, useState } from 'react';

/** Fenêtre d'annulation après « Appliquer » (FRONTEND.md §4.4) : garde-fou si l'horloge du téléphone dérive. */
const ANNULATION_MAX_S = 10;
const PAS_MS = 250;

/** Secondes restantes avant `finIso` (heure du serveur), recalculées en continu ; 0 quand c'est passé. */
export function useSecondesRestantes(finIso: string | null): number {
  const fin = finIso ? Date.parse(finIso) : Number.NaN;
  const [maintenant, setMaintenant] = useState(() => Date.now());

  useEffect(() => {
    if (Number.isNaN(fin)) return undefined;
    const tic = () => {
      const n = Date.now();
      setMaintenant(n);
      if (n >= fin) clearInterval(minuteur);
    };
    const minuteur = setInterval(tic, PAS_MS);
    const premier = setTimeout(tic, 0);
    return () => {
      clearInterval(minuteur);
      clearTimeout(premier);
    };
  }, [fin]);

  if (Number.isNaN(fin)) return 0;
  return Math.min(ANNULATION_MAX_S, Math.max(0, Math.ceil((fin - maintenant) / 1000)));
}

import * as Linking from 'expo-linking';
import { useEffect, useRef } from 'react';

import { lireLienAuth } from '@/lib/liensAuth';
import { supabase } from '@/lib/supabase';

type Rappels = {
  /** Lien de réinitialisation du mot de passe : l'athlète doit choisir un nouveau mot de passe. */
  onRecuperation: (active: boolean) => void;
  onErreur: (message: string | null) => void;
};

/** Ouvre la session reçue par lien (Google, Apple, mot de passe oublié). Chaque lien n'est traité qu'une fois. */
export function useLiensAuth({ onRecuperation, onErreur }: Rappels) {
  const url = Linking.useURL();
  const traites = useRef(new Set<string>());

  useEffect(() => {
    if (!url || traites.current.has(url)) return;
    traites.current.add(url);
    const lien = lireLienAuth(url);
    if (!lien) return;
    if ('erreur' in lien) {
      onErreur(lien.erreur);
      return;
    }
    onErreur(null);
    if (lien.recuperation) onRecuperation(true);
    supabase.auth.setSession(lien.jetons).then(({ error }) => {
      if (error) {
        onRecuperation(false);
        onErreur(error.message);
      }
    });
  }, [url, onRecuperation, onErreur]);
}

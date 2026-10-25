import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { abonner, lister } from './fileEnvoi';
import { abonnerReseau, viderFile } from './envoi';

const INTERVALLE_MS = 20_000;

/**
 * Envoie la file en attente : au démarrage, au retour au premier plan, après chaque ajout,
 * puis toutes les 20 s tant qu'il reste quelque chose (pas de détection réseau sans NetInfo).
 * Renvoie le nombre d'entrées en attente et si le dernier essai a échoué faute de réseau.
 */
export function useFileEnvoi() {
  const [enAttente, setEnAttente] = useState(0);
  const [horsLigne, setHorsLigne] = useState(false);

  useEffect(() => {
    let actif = true;
    const essayer = () => viderFile().catch(() => undefined);
    const desabonnerReseau = abonnerReseau((h) => actif && setHorsLigne(h));

    lister().then((liste) => {
      if (!actif) return;
      setEnAttente(liste.length);
      if (liste.length) essayer();
    });
    const desabonner = abonner((nombre) => {
      setEnAttente(nombre);
    });
    const etat = AppState.addEventListener('change', (e) => e === 'active' && essayer());
    const minuteur = setInterval(() => {
      lister().then((liste) => {
        if (liste.length) essayer();
      });
    }, INTERVALLE_MS);

    return () => {
      actif = false;
      desabonner();
      desabonnerReseau();
      etat.remove();
      clearInterval(minuteur);
    };
  }, []);

  return { enAttente, horsLigne: horsLigne && enAttente > 0 };
}

import NetInfo from '@react-native-community/netinfo';
import { useEffect, useState } from 'react';
import { AppState } from 'react-native';

import { abonner, lister } from './fileEnvoi';
import { abonnerReseau, viderFile } from './envoi';

/** Serveur en panne alors que le réseau est là : on réessaie à ce rythme. */
const INTERVALLE_MS = 30_000;

/**
 * Envoie la file en attente : au démarrage, au retour du réseau (NetInfo), au retour au premier plan,
 * après chaque ajout, puis toutes les 30 s tant qu'il reste quelque chose (serveur momentanément en panne).
 * Renvoie le nombre d'entrées en attente et si l'on est hors ligne (réseau coupé ou dernier envoi impossible).
 */
export function useFileEnvoi() {
  const [enAttente, setEnAttente] = useState(0);
  const [echecReseau, setEchecReseau] = useState(false);
  const [connecte, setConnecte] = useState(true);

  useEffect(() => {
    let actif = true;
    let etaitConnecte = true;
    const essayer = () => viderFile().catch(() => undefined);
    const desabonnerReseau = abonnerReseau((h) => actif && setEchecReseau(h));
    const desabonnerNetInfo = NetInfo.addEventListener((etat) => {
      // `isConnected` vaut null tant que l'état est inconnu : on ne conclut pas à une coupure.
      const maintenant = etat.isConnected !== false;
      if (actif) setConnecte(maintenant);
      if (maintenant && !etaitConnecte) essayer();
      etaitConnecte = maintenant;
    });

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
        if (liste.length && etaitConnecte) essayer();
      });
    }, INTERVALLE_MS);

    return () => {
      actif = false;
      desabonner();
      desabonnerReseau();
      desabonnerNetInfo();
      etat.remove();
      clearInterval(minuteur);
    };
  }, []);

  return { enAttente, horsLigne: enAttente > 0 && (!connecte || echecReseau) };
}

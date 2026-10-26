import { useEffect, useState } from 'react';

const DUREE_CONFIRMATION_MS = 3000;

/**
 * Ouverture de la feuille « Ajouter un résultat » et message de confirmation.
 * `ouvertAuDepart` : paramètre `ajouter` de l'adresse (« 1 », ou le slug d'un test à présélectionner).
 */
export function useFeuilleAjout(ouvertAuDepart?: string) {
  const [feuille, setFeuille] = useState<{ visible: boolean; type?: string }>({
    visible: Boolean(ouvertAuDepart),
    type: ouvertAuDepart && ouvertAuDepart !== '1' ? ouvertAuDepart : undefined,
  });
  const [confirmation, setConfirmation] = useState(false);

  useEffect(() => {
    if (!confirmation) return;
    const minuteur = setTimeout(() => setConfirmation(false), DUREE_CONFIRMATION_MS);
    return () => clearTimeout(minuteur);
  }, [confirmation]);

  return {
    visible: feuille.visible,
    typeInitial: feuille.type,
    confirmation,
    ouvrir: (type?: string) => setFeuille({ visible: true, type }),
    fermer: () => setFeuille((f) => ({ ...f, visible: false })),
    enregistre: () => {
      setFeuille((f) => ({ ...f, visible: false }));
      setConfirmation(true);
    },
  };
}

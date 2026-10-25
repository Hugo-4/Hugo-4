import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { ouvrirCoach } from '@/features/coach/ouvrirCoach';
import { formatJourDate } from '@/lib/format';

import { etatsRequete } from './etatRequete';
import { useLegende, useSeanceProgramme } from './requetes';
import type { ReponseManquee } from './types';

/** Durée d'affichage du message de confirmation (déplacée, manquée). */
const DUREE_TOAST_MS = 4_000;

type FeuilleOuverte = 'deplacer' | 'manquee' | null;

/** Détail d'une séance prévue : données, feuilles Déplacer / Séance manquée, message de confirmation, navigation. */
export function useEcranSeance(id: string | undefined) {
  const { t } = useTranslation();
  const requete = useSeanceProgramme(id);
  const legende = useLegende();
  const [feuille, setFeuille] = useState<FeuilleOuverte>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [rafraichissement, setRafraichissement] = useState(false);

  useEffect(() => {
    if (!toast) return;
    const minuteur = setTimeout(() => setToast(null), DUREE_TOAST_MS);
    return () => clearTimeout(minuteur);
  }, [toast]);

  const detail = requete.data;
  return {
    ...etatsRequete(requete),
    detail,
    legende: legende.data,
    reessayer: () => requete.refetch(),
    rafraichissement,
    rafraichir: async () => {
      setRafraichissement(true);
      try {
        await requete.refetch();
      } finally {
        setRafraichissement(false);
      }
    },
    feuille,
    ouvrirFeuille: setFeuille,
    fermerFeuille: () => setFeuille(null),
    toast,
    deplacee: (date: string) => {
      setFeuille(null);
      setToast(t('programme.deplacer.ok', { date: formatJourDate(date) }));
    },
    manquee: (reponse: ReponseManquee) => {
      setFeuille(null);
      setToast(t(reponse.statut === 'a_reporter' ? 'programme.manquee.okReporter' : 'programme.manquee.ok'));
    },
    demarrer: () => id && router.push({ pathname: '/seance/[id]', params: { id } }),
    modifierAvecCoach: () =>
      detail && id && ouvrirCoach({ type: 'seance', programmeSeanceId: id, titre: detail.nom ?? detail.seance.titre }),
    ouvrirExercice: (slug: string) => router.push({ pathname: '/exercice/[slug]', params: { slug } }),
  };
}

export type EcranSeance = ReturnType<typeof useEcranSeance>;

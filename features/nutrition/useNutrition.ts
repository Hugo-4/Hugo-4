import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useNutritionJour } from '@/features/accueil/useNutritionJour';
import { dateDuJour } from '@/features/checkin/dateDuJour';
import { ajouterJours } from '@/features/progres/dates';

import { equilibre, totaux } from './calcul';
import { MOMENTS_REPAS, type LigneRepas, type MomentRepas } from './types';
import { useActionsRepas, useJournal, useObjectifsNutritionnels } from './useJournal';

export type GroupeRepas = { moment: MomentRepas; lignes: LigneRepas[]; total: ReturnType<typeof totaux> };

/**
 * Écran Nutrition : jour affiché, journal de ce jour, objectifs (serveur), plan autour de la séance (aujourd'hui
 * seulement : `GET /nutrition/jour` ne connaît que le jour même), totaux et répartition par moment.
 */
export function useNutrition() {
  const { t } = useTranslation();
  const aujourdhui = dateDuJour();
  const [date, setDate] = useState(aujourdhui);
  const estAujourdhui = date === aujourdhui;
  const journal = useJournal(date);
  const objectifs = useObjectifsNutritionnels();
  const plan = useNutritionJour();
  const actions = useActionsRepas();

  const calcule = useMemo(() => {
    const lignes = journal.data ?? [];
    const total = totaux(lignes);
    const groupes: GroupeRepas[] = MOMENTS_REPAS.map((moment) => {
      const duMoment = lignes.filter((l) => l.moment === moment);
      return { moment, lignes: duMoment, total: totaux(duMoment) };
    }).filter((g) => g.lignes.length > 0);
    return { lignes, total, groupes, equilibre: equilibre(total) };
  }, [journal.data]);

  const retirer = (ligne: LigneRepas) =>
    Alert.alert(t('nutrition.repas.retirerTitre'), ligne.nom, [
      { text: t('commun.annuler'), style: 'cancel' },
      { text: t('nutrition.repas.retirerConfirmer'), style: 'destructive', onPress: () => actions.supprimer.mutate(ligne.id) },
    ]);

  return {
    date,
    estAujourdhui,
    precedent: () => setDate((d) => ajouterJours(d, -1)),
    suivant: () => setDate((d) => (d < aujourdhui ? ajouterJours(d, 1) : d)),
    journal,
    objectifs,
    // Le plan du jour ne vaut que pour aujourd'hui ; `null` = poids inconnu.
    plan: estAujourdhui ? plan : null,
    actions,
    retirer,
    ...calcule,
  };
}

import { useMemo, useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useNutritionJour } from '@/features/accueil/useNutritionJour';
import { dateDuJour } from '@/features/checkin/dateDuJour';
import { ajouterJours } from '@/features/progres/dates';

import { equilibre, totaux } from './calcul';
import { MOMENTS_REPAS, type EntreeJournal, type MomentRepas, type TotauxJour } from './types';
import { useActionsRepas, useJournal, useObjectifsNutritionnels, useTotauxJour } from './useJournal';

export type GroupeRepas = { moment: MomentRepas; lignes: EntreeJournal[]; total: ReturnType<typeof totaux> };

const TOTAUX_VIDES: TotauxJour = { calories: 0, proteines: 0, glucides: 0, lipides: 0, fibres: 0, sucres: 0, sodium_mg: 0 };

/**
 * Écran Nutrition : jour affiché, journal de ce jour, totaux du jour (`journal_nutrition`), objectifs (serveur), plan
 * autour de la séance (aujourd'hui seulement : `GET /nutrition/jour` ne connaît que le jour même), répartition par
 * moment et micronutriments (somme des entrées, absents des totaux du jour).
 */
export function useNutrition() {
  const { t } = useTranslation();
  const aujourdhui = dateDuJour();
  const [date, setDate] = useState(aujourdhui);
  const estAujourdhui = date === aujourdhui;
  const journal = useJournal(date);
  const totauxJour = useTotauxJour(date);
  const objectifs = useObjectifsNutritionnels();
  const plan = useNutritionJour();
  const actions = useActionsRepas();

  const calcule = useMemo(() => {
    const lignes = journal.data ?? [];
    const groupes: GroupeRepas[] = MOMENTS_REPAS.map((moment) => {
      const duMoment = lignes.filter((l) => l.moment_journee === moment);
      return { moment, lignes: duMoment, total: totaux(duMoment) };
    }).filter((g) => g.lignes.length > 0);
    const total = totauxJour.data ?? TOTAUX_VIDES;
    return { lignes, total, micros: totaux(lignes).micros, groupes, equilibre: equilibre(total) };
  }, [journal.data, totauxJour.data]);

  const retirer = (ligne: EntreeJournal) =>
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
    totauxJour,
    objectifs,
    // Le plan du jour ne vaut que pour aujourd'hui ; `null` = poids inconnu.
    plan: estAujourdhui ? plan : null,
    actions,
    retirer,
    ...calcule,
  };
}

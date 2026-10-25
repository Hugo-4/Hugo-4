import { router } from 'expo-router';
import { useState } from 'react';
import { Alert } from 'react-native';
import { useTranslation } from 'react-i18next';

import { TYPE_PAR_PRECISION } from './constantes';
import { useEnregistrerEvenement, useSupprimerEvenement } from './mutationsEvenement';
import { conflitA, doublon, precisionDuSport } from './presentation';
import { corpsDepuisSaisie, erreursSaisie, type SaisieEvenement, saisieInitiale, type SportOption } from './saisieEvenement';
import type { Evenement } from './types';

type Params = { evenement: Evenement | null; evenements: Evenement[]; sports: SportOption[] };

/**
 * Formulaire d'une compétition : saisie, validation, règle d'une seule A par sport (confirmation, l'ancienne passe
 * en B), pas de doublon (même nom + même date : mise à jour), suppression avec confirmation.
 */
export function useFormulaireEvenement({ evenement, evenements, sports }: Params) {
  const { t } = useTranslation();
  const enregistrement = useEnregistrerEvenement();
  const suppression = useSupprimerEvenement();
  const [saisie, setSaisie] = useState<SaisieEvenement>(() => saisieInitiale(evenement, sports));
  const [tentative, setTentative] = useState(false);
  const creation = evenement === null;
  const sport = sports.find((s) => s.id === saisie.sportId) ?? null;
  const precision = precisionDuSport(sport?.slug ?? evenement?.sports?.slug);
  const erreurs = erreursSaisie(saisie, precision, creation);
  const valide = Object.keys(erreurs).length === 0;

  const modifier = (changement: Partial<SaisieEvenement>) => setSaisie((s) => ({ ...s, ...changement }));

  /** Changer de sport change la précision demandée (et, à la création, le type proposé). */
  const changerSport = (option: SportOption) => {
    const nouvelle = precisionDuSport(option.slug);
    modifier({
      sportId: option.id,
      ...(nouvelle !== precision ? { precision: '' } : {}),
      ...(creation ? { type: nouvelle ? TYPE_PAR_PRECISION[nouvelle] : 'competition' } : {}),
    });
  };

  const enregistrer = () => {
    setTentative(true);
    if (!valide || enregistrement.isPending) return;
    const { corps, poidsKg } = corpsDepuisSaisie(saisie, sport, precision);
    const id = evenement?.id ?? doublon(evenements, corps.nom, corps.date_evenement)?.id;
    const envoyer = (retrograderId?: string) =>
      enregistrement.mutate({ id, corps, poidsKg, retrograderId }, { onSuccess: () => router.back() });
    const autreA = corps.priorite === 'A' ? conflitA(evenements, saisie.sportId, id) : null;
    if (!autreA) return envoyer();
    Alert.alert(t('programme.evenement.conflitTitre'), t('programme.evenement.conflitTexte', { nom: autreA.nom }), [
      { text: t('commun.annuler'), style: 'cancel' },
      { text: t('programme.evenement.conflitConfirmer'), onPress: () => envoyer(autreA.id) },
    ]);
  };

  const supprimer = () => {
    if (!evenement) return;
    Alert.alert(t('programme.evenement.supprimerTitre', { nom: evenement.nom }), t('programme.evenement.supprimerTexte'), [
      { text: t('commun.annuler'), style: 'cancel' },
      {
        text: t('programme.evenement.supprimer'),
        style: 'destructive',
        onPress: () => suppression.mutate(evenement.id, { onSuccess: () => router.back() }),
      },
    ]);
  };

  return {
    creation,
    saisie,
    modifier,
    changerSport,
    sports,
    precision,
    erreurs: tentative ? erreurs : {},
    enregistrer,
    supprimer,
    enCours: enregistrement.isPending || suppression.isPending,
    erreurEnvoi: enregistrement.error ?? suppression.error,
  };
}

export type FormulaireEvenement = ReturnType<typeof useFormulaireEvenement>;

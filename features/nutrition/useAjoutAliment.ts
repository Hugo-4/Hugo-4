import { router } from 'expo-router';
import { useMemo, useState } from 'react';

import { dateDuJour } from '@/features/checkin/dateDuJour';
import { lireNombre } from '@/features/questionnaire/saisie';

import { momentParDefaut, nutrimentsPour } from './calcul';
import { MOMENTS_REPAS, type Aliment, type MomentRepas, type NouvelleLigne, type Nutriments } from './types';
import { useActionsRepas } from './useJournal';
import { useRechercheAliments } from './useRechercheAliments';

export type ChampsLibres = { nom: string; calories: string; proteines: string; glucides: string; lipides: string };
const LIBRES_VIDES: ChampsLibres = { nom: '', calories: '', proteines: '', glucides: '', lipides: '' };

const estMoment = (v: string | undefined): v is MomentRepas => MOMENTS_REPAS.includes(v as MomentRepas);
const QUANTITE_MAX = 3000;

/**
 * Noter un aliment : recherche dans la base `aliments`, portion en grammes et moment, ou saisie libre
 * (nom, calories, macronutriments) pour un aliment absent de la base. Enregistré dans `repas_journal`.
 */
export function useAjoutAliment(params: { date?: string; moment?: string }) {
  const date = params.date && /^\d{4}-\d{2}-\d{2}$/.test(params.date) ? params.date : dateDuJour();
  const [recherche, setRecherche] = useState('');
  const [aliment, setAliment] = useState<Aliment | null>(null);
  const [libre, setLibre] = useState(false);
  const [quantite, setQuantite] = useState('');
  const [moment, setMoment] = useState<MomentRepas>(estMoment(params.moment) ? params.moment : momentParDefaut());
  const [champs, setChamps] = useState<ChampsLibres>(LIBRES_VIDES);
  const [tente, setTente] = useState(false);
  const resultats = useRechercheAliments(recherche);
  const { ajouter } = useActionsRepas();

  const grammes = lireNombre(quantite);
  const quantiteValide = grammes !== null && grammes > 0 && grammes <= QUANTITE_MAX;
  const apercu: Nutriments | null = useMemo(
    () => (aliment && quantiteValide ? nutrimentsPour(aliment, grammes as number) : null),
    [aliment, grammes, quantiteValide],
  );

  const choisir = (a: Aliment) => {
    setAliment(a);
    setQuantite(String(a.portion_standard_g ?? 100));
    setTente(false);
  };
  const changer = () => {
    setAliment(null);
    setLibre(false);
    setTente(false);
  };
  const saisirALaMain = () => {
    setLibre(true);
    setChamps({ ...LIBRES_VIDES, nom: recherche.trim() });
    setQuantite('');
    setTente(false);
  };

  // Saisie libre : nom obligatoire, valeurs ≥ 0 si remplies.
  const positif = (v: string) => v.trim() === '' || (lireNombre(v) ?? -1) >= 0;
  const erreurs = {
    quantite: !quantiteValide,
    nom: libre && champs.nom.trim().length === 0,
    valeurs: libre && !(['calories', 'proteines', 'glucides', 'lipides'] as const).every((c) => positif(champs[c])),
  };

  const ligne = (): NouvelleLigne | null => {
    if (erreurs.quantite || erreurs.nom || erreurs.valeurs) return null;
    if (aliment && apercu) {
      return { ...apercu, date_repas: date, moment, aliment_id: aliment.id, nom: aliment.nom, quantite_g: grammes as number, source: 'aliment' };
    }
    if (!libre) return null;
    const n = (v: string) => lireNombre(v) ?? 0;
    return {
      date_repas: date,
      moment,
      aliment_id: null,
      nom: champs.nom.trim().slice(0, 120),
      quantite_g: grammes as number,
      calories: Math.round(n(champs.calories)),
      proteines_g: n(champs.proteines),
      glucides_g: n(champs.glucides),
      lipides_g: n(champs.lipides),
      fibres_g: 0,
      sucres_g: 0,
      micros: {},
      source: 'saisie_libre',
    };
  };

  const enregistrer = () => {
    setTente(true);
    const l = ligne();
    if (l) ajouter.mutate(l, { onSuccess: () => router.back() });
  };

  return {
    date,
    recherche,
    setRecherche,
    resultats,
    aliment,
    libre,
    choisir,
    changer,
    saisirALaMain,
    quantite,
    setQuantite,
    moment,
    setMoment,
    champs,
    modifierChamps: (c: Partial<ChampsLibres>) => setChamps((x) => ({ ...x, ...c })),
    apercu,
    erreurs: tente ? erreurs : { quantite: false, nom: false, valeurs: false },
    enregistrer,
    enCours: ajouter.isPending,
    erreurEnvoi: ajouter.error,
  };
}

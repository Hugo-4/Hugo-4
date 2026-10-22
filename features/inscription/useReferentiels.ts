import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

import { type Ambition, type Encadrement, type Impact, type Precision, SLUG_SPORT_EXCLU } from './constantes';

export type Referentiel = { id: string; slug: string; nom: string };

/** Libellés bilingues tels qu'ils sont stockés en base (`libelle_fr` / `libelle_en`). */
export type Bilingue = { fr: string; en: string };

export type ObjectifSport = {
  id: string;
  slug: string;
  ambition: Ambition;
  libelle: Bilingue;
  description: Bilingue | null;
  echeanceRequise: boolean;
  precisionDemandee: Precision | null;
  qualitePrincipale: string;
};

export type Besoin = { slug: string; libelle: Bilingue };

export type SportRecommande = { sportId: string; slug: string; nom: string; raisons: Bilingue[] };

const INFINI = { staleTime: Infinity } as const;

/** Sports proposés (table `sports`, actifs, sans « général »). */
export function useSports() {
  return useQuery({
    queryKey: ['referentiels', 'sports'],
    ...INFINI,
    queryFn: async (): Promise<Referentiel[]> => {
      const { data, error } = await supabase
        .from('sports')
        .select('id, slug, nom')
        .eq('actif', true)
        .neq('slug', SLUG_SPORT_EXCLU)
        .order('nom');
      if (error) throw error;
      return data;
    },
  });
}

/** Objectifs précis d'un sport (`objectifs_sport`), toutes ambitions, dans l'ordre. */
export function useObjectifsSport(sportId: string | null) {
  return useQuery({
    queryKey: ['referentiels', 'objectifsSport', sportId],
    enabled: Boolean(sportId),
    ...INFINI,
    queryFn: async (): Promise<ObjectifSport[]> => {
      const { data, error } = await supabase
        .from('objectifs_sport')
        .select(
          'id, slug, ambition, libelle_fr, libelle_en, description_fr, description_en, echeance_requise, precision_demandee, qualite_principale',
        )
        .eq('sport_id', sportId as string)
        .eq('actif', true)
        .order('ordre');
      if (error) throw error;
      return data.map((o) => ({
        id: o.id,
        slug: o.slug,
        ambition: o.ambition,
        libelle: { fr: o.libelle_fr, en: o.libelle_en },
        description: o.description_fr ? { fr: o.description_fr, en: o.description_en ?? o.description_fr } : null,
        echeanceRequise: o.echeance_requise,
        precisionDemandee: o.precision_demandee,
        qualitePrincipale: o.qualite_principale,
      }));
    },
  });
}

/** Besoins du parcours B (`besoins_debutant`). */
export function useBesoins() {
  return useQuery({
    queryKey: ['referentiels', 'besoins'],
    ...INFINI,
    queryFn: async (): Promise<Besoin[]> => {
      const { data, error } = await supabase.from('besoins_debutant').select('slug, libelle_fr, libelle_en').order('ordre');
      if (error) throw error;
      return data.map((b) => ({ slug: b.slug, libelle: { fr: b.libelle_fr, en: b.libelle_en } }));
    },
  });
}

/** Objectifs secondaires proposables (`objectifs_entrainement.proposable_en_secondaire`). */
export function useObjectifsSecondaires() {
  return useQuery({
    queryKey: ['referentiels', 'objectifsSecondaires'],
    ...INFINI,
    queryFn: async (): Promise<string[]> => {
      const { data, error } = await supabase
        .from('objectifs_entrainement')
        .select('slug')
        .eq('proposable_en_secondaire', true)
        .order('ordre');
      if (error) throw error;
      return data.map((o) => o.slug);
    },
  });
}

export type ParametresRecommandation = {
  besoins: string[];
  impactMax: Impact;
  lieux: string[];
  encadrement: Encadrement;
  minutesSemaine: number;
  age: number | null;
};

/** Trois sports recommandés par la base (`rpc('recommander_sports')`), chacun avec ses raisons. */
export function useRecommandations(p: ParametresRecommandation | null) {
  return useQuery({
    queryKey: ['recommandations', p],
    enabled: p !== null,
    queryFn: async (): Promise<SportRecommande[]> => {
      const parametres = p as ParametresRecommandation;
      const { data, error } = await supabase.rpc('recommander_sports', {
        p_besoins: parametres.besoins,
        p_impact_max: parametres.impactMax,
        p_lieux: parametres.lieux,
        p_prefere_encadre: parametres.encadrement === 'indifferent' ? null : parametres.encadrement === 'club',
        p_minutes_semaine: parametres.minutesSemaine,
        p_age: parametres.age,
      });
      if (error) throw error;
      return (data as { sport_id: string; sport_slug: string; sport_nom: string; raisons_fr: string[]; raisons_en: string[] }[]).map(
        (s) => ({
          sportId: s.sport_id,
          slug: s.sport_slug,
          nom: s.sport_nom,
          raisons: s.raisons_fr.map((fr, i) => ({ fr, en: s.raisons_en[i] ?? fr })),
        }),
      );
    },
  });
}

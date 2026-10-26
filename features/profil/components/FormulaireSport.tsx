import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { Chip } from '@/components/Chip';
import { ChoixCadre } from '@/features/inscription/components/ChoixCadre';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { type Ambition, type Cadre, NIVEAUX, type Niveau } from '@/features/inscription/constantes';
import { libelleReferentiel } from '@/features/inscription/libelles';
import { useObjectifsSport } from '@/features/inscription/useReferentiels';

import type { SportAthlete } from '../types';
import { useModifierSport } from '../useModifierProfil';
import { ChoixObjectifPrincipal } from './ChoixObjectifPrincipal';
import { ChoixSecondaires } from './ChoixSecondaires';
import { EcranEdition } from './EcranEdition';

export function FormulaireSport({ sport }: { sport: SportAthlete }) {
  const { t } = useTranslation();
  const principal = sport.role === 'principal';
  const [niveau, setNiveau] = useState<Niveau | null>(sport.niveau);
  const [cadre, setCadre] = useState<Cadre>(sport.cadre_pratique);
  const [ambition, setAmbition] = useState<Ambition | null>(sport.ambition);
  const [objectifId, setObjectifId] = useState<string | null>(sport.objectif_sport_id);
  const [secondaires, setSecondaires] = useState<string[]>(sport.objectifs_secondaires ?? []);
  const objectifs = useObjectifsSport(principal ? (sport.sports?.id ?? null) : null);
  const objectif = objectifs.data?.find((o) => o.id === objectifId && o.ambition === ambition);
  const modification = useModifierSport();
  const nom = sport.sports ? libelleReferentiel('sports', sport.sports) : '';
  const valide = niveau !== null && (!principal || (ambition !== null && objectif !== undefined));

  const enregistrer = () => {
    if (!niveau) return;
    const fin = { onSuccess: () => router.back() };
    if (principal && ambition && objectif) {
      modification.mutate({ id: sport.id, principal: true, niveau, ambition, objectif, secondaires }, fin);
    } else if (!principal) {
      modification.mutate({ id: sport.id, principal: false, niveau, cadre }, fin);
    }
  };

  return (
    <EcranEdition
      titre={nom}
      enregistrementActif={valide && !modification.isPending}
      onEnregistrer={enregistrer}
      bandeau={modification.isError ? <ErreurEnregistrement erreur={modification.error} /> : null}>
      <BandeauHorsLigne />
      <GroupeChoix titre={t('inscription.etapes.niveau.titre')} radio>
        {NIVEAUX.map((n) => (
          <Chip key={n} role="radio" label={t(`inscription.niveau.${n}.titre`)} selectionne={niveau === n} onPress={() => setNiveau(n)} />
        ))}
      </GroupeChoix>
      {principal && sport.sports ? (
        <>
          <ChoixObjectifPrincipal
            sportId={sport.sports.id}
            ambition={ambition}
            objectifId={objectifId}
            onAmbition={(a) => {
              setAmbition(a);
              setObjectifId(null);
            }}
            onObjectif={setObjectifId}
          />
          <ChoixSecondaires valeur={secondaires} onChange={setSecondaires} />
        </>
      ) : (
        <ChoixCadre titre={t('profil.sports.cadre')} valeur={cadre} onChange={setCadre} />
      )}
    </EcranEdition>
  );
}

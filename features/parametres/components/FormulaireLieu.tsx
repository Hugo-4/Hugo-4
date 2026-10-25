import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';
import { Interrupteur } from '@/components/Interrupteur';
import { TextField } from '@/components/TextField';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { EcranEdition } from '@/features/profil/components/EcranEdition';

import { TYPES_LIEU } from '../constantes';
import type { Lieu, SaisieLieu } from '../types';
import { useEnregistrerLieu } from '../useLieux';

const saisieDepuis = (lieu: Lieu | null): SaisieLieu => ({
  nom: lieu?.nom ?? '',
  type_lieu: lieu?.type_lieu ?? 'salle',
  salle_complete: lieu?.salle_complete ?? false,
  par_defaut: lieu?.par_defaut ?? false,
  ville: lieu?.ville ?? '',
  notes: lieu?.notes ?? '',
});

/** Ajout (`initial` nul) ou modification d'un lieu (la suppression se fait depuis la liste). */
export function FormulaireLieu({ initial }: { initial: Lieu | null }) {
  const { t } = useTranslation();
  const [saisie, setSaisie] = useState(() => saisieDepuis(initial));
  const enregistrement = useEnregistrerLieu();
  const changer = (changement: Partial<SaisieLieu>) => setSaisie((s) => ({ ...s, ...changement }));
  const salle = saisie.type_lieu === 'salle' || saisie.type_lieu === 'club';

  return (
    <EcranEdition
      titre={t(initial ? 'parametres.lieux.modifier' : 'parametres.lieux.nouveau')}
      enregistrementActif={saisie.nom.trim().length > 0 && !enregistrement.isPending}
      onEnregistrer={() => enregistrement.mutate({ saisie, initial }, { onSuccess: () => router.back() })}
      bandeau={enregistrement.isError ? <ErreurEnregistrement erreur={enregistrement.error} /> : null}>
      <TextField
        label={t('parametres.lieux.nom')}
        placeholder={t('parametres.lieux.nomExemple')}
        value={saisie.nom}
        onChangeText={(nom) => changer({ nom })}
        maxLength={80}
      />
      <GroupeChoix titre={t('parametres.lieux.type')} radio>
        {TYPES_LIEU.map((type) => (
          <Chip
            key={type}
            role="radio"
            label={t(`parametres.lieux.types.${type}`)}
            selectionne={saisie.type_lieu === type}
            onPress={() => changer({ type_lieu: type })}
          />
        ))}
      </GroupeChoix>
      {salle ? (
        <Interrupteur
          libelle={t('parametres.lieux.salleComplete')}
          aide={t('parametres.lieux.salleCompleteAide')}
          valeur={saisie.salle_complete}
          onChange={(salle_complete) => changer({ salle_complete })}
        />
      ) : null}
      <Interrupteur
        libelle={t('parametres.lieux.parDefaut')}
        aide={t('parametres.lieux.parDefautAide')}
        valeur={saisie.par_defaut}
        onChange={(par_defaut) => changer({ par_defaut })}
      />
      <TextField
        label={t('parametres.lieux.ville')}
        aide={t('parametres.lieux.villeAide')}
        value={saisie.ville}
        onChangeText={(ville) => changer({ ville })}
        autoCapitalize="words"
        maxLength={80}
      />
      <TextField
        label={t('parametres.lieux.notes')}
        value={saisie.notes}
        onChangeText={(notes) => changer({ notes })}
        multiline
        maxLength={300}
      />
    </EcranEdition>
  );
}

import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { Chip } from '@/components/Chip';
import { DateField } from '@/components/DateField';
import { TextField } from '@/components/TextField';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { AGE_MIN_SANS_PARENT, PAYS } from '@/features/inscription/constantes';
import { age, dateIso } from '@/features/inscription/dates';
import type { DateSaisie } from '@/features/inscription/types';
import { MessageErreur } from '@/features/auth/components/MessageErreur';

import type { Identite } from '../types';
import { useModifierIdentite } from '../useModifierProfil';
import { EcranEdition } from './EcranEdition';

function versSaisie(iso: string | null): DateSaisie {
  if (!iso) return { jour: '', mois: '', annee: '' };
  const [annee, mois, jour] = iso.split('-');
  return { jour, mois, annee };
}

export function FormulaireIdentite({ initiale }: { initiale: Identite }) {
  const { t } = useTranslation();
  const [prenom, setPrenom] = useState(initiale.prenom ?? '');
  const [naissance, setNaissance] = useState<DateSaisie>(versSaisie(initiale.dateNaissance));
  const [pays, setPays] = useState(initiale.pays ?? '');
  const modification = useModifierIdentite();

  const iso = dateIso(naissance);
  const mineur = iso !== null && age(iso) < AGE_MIN_SANS_PARENT;
  const valide = prenom.trim().length > 0 && iso !== null && !mineur && pays !== '';

  return (
    <EcranEdition
      titre={t('profil.identite.titre')}
      enregistrementActif={valide && !modification.isPending}
      onEnregistrer={() =>
        iso && modification.mutate({ prenom, dateNaissance: iso, pays }, { onSuccess: () => router.back() })
      }
      bandeau={
        mineur ? (
          <MessageErreur texte={t('profil.identite.mineur')} />
        ) : modification.isError ? (
          <ErreurEnregistrement erreur={modification.error} />
        ) : null
      }>
      <BandeauHorsLigne />
      <TextField label={t('inscription.identite.prenom')} value={prenom} onChangeText={setPrenom} autoCapitalize="words" />
      <DateField
        label={t('inscription.identite.naissance')}
        valeur={naissance}
        onChange={setNaissance}
        erreur={naissance.annee.length === 4 && !iso ? t('inscription.erreurs.date') : undefined}
      />
      <GroupeChoix titre={t('profil.identite.pays')} radio>
        {PAYS.map((code) => (
          <Chip key={code} role="radio" label={t(`pays.${code}`)} selectionne={pays === code} onPress={() => setPays(code)} />
        ))}
      </GroupeChoix>
    </EcranEdition>
  );
}

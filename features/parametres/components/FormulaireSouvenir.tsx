import { router } from 'expo-router';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { TextField } from '@/components/TextField';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { EcranEdition } from '@/features/profil/components/EcranEdition';

import { confirmer } from '../confirmer';
import { LONGUEUR_SOUVENIR } from '../constantes';
import type { Souvenir } from '../types';
import { useModifierSouvenir, useSupprimerSouvenir } from '../useMemoire';

/** Un élément retenu : corriger le texte, confirmer, désactiver / réactiver, effacer (confirmation). */
export function FormulaireSouvenir({ souvenir }: { souvenir: Souvenir }) {
  const { t } = useTranslation();
  const [contenu, setContenu] = useState(souvenir.contenu);
  const modification = useModifierSouvenir();
  const suppression = useSupprimerSouvenir();
  const enCours = modification.isPending || suppression.isPending;
  const erreur = modification.error ?? suppression.error;
  const texteModifie = contenu.trim() !== souvenir.contenu && contenu.trim().length > 0;
  const modifier = (m: Parameters<typeof modification.mutate>[0]['modification']) =>
    modification.mutate({ id: souvenir.id, modification: m });

  return (
    <EcranEdition
      titre={t('parametres.memoire.modifier')}
      enregistrementActif={texteModifie && !enCours}
      onEnregistrer={() =>
        modification.mutate(
          { id: souvenir.id, modification: { contenu: contenu.trim() } },
          { onSuccess: () => router.back() },
        )
      }
      bandeau={erreur ? <ErreurEnregistrement erreur={erreur} /> : null}>
      <TextField
        label={t('parametres.memoire.texte')}
        aide={t('parametres.memoire.texteAide', { nombre: contenu.length, max: LONGUEUR_SOUVENIR })}
        value={contenu}
        onChangeText={setContenu}
        multiline
        maxLength={LONGUEUR_SOUVENIR}
      />
      {souvenir.confirme ? (
        <AppText variant="corpsGras">{t('parametres.memoire.confirme')}</AppText>
      ) : (
        <Button
          label={t('parametres.memoire.confirmer')}
          variant="secondaire"
          disabled={enCours}
          onPress={() => modifier({ confirme: true })}
        />
      )}
      <Button
        label={t(souvenir.actif ? 'parametres.memoire.desactiver' : 'parametres.memoire.reactiver')}
        variant="secondaire"
        disabled={enCours}
        onPress={() => modifier({ actif: !souvenir.actif })}
      />
      <Button
        label={t('parametres.memoire.supprimer')}
        variant="secondaire"
        disabled={enCours}
        onPress={() =>
          confirmer({
            titre: t('parametres.memoire.confirmerTitre'),
            texte: t('parametres.memoire.confirmerTexte'),
            action: t('parametres.memoire.confirmerSuppression'),
            onConfirmer: () => suppression.mutate(souvenir.id, { onSuccess: () => router.back() }),
          })
        }
      />
    </EcranEdition>
  );
}

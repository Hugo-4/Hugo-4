import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Chip } from '@/components/Chip';
import { ChoixCadre } from '@/features/inscription/components/ChoixCadre';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { ListeReferentiel } from '@/features/inscription/components/ListeReferentiel';
import { type Cadre, NIVEAUX, type Niveau } from '@/features/inscription/constantes';
import { descriptionObjectif, libelleReferentiel } from '@/features/inscription/libelles';
import { useObjectifs } from '@/features/inscription/useReferentiels';
import { colors, spacing } from '@/theme/tokens';

import type { SportAthlete } from '../types';
import { useModifierSport } from '../useModifierProfil';
import { EcranEdition } from './EcranEdition';

/** Niveau, cadre de pratique et (pour le sport principal) objectif d'un sport. */
export function FormulaireSport({ sport }: { sport: SportAthlete }) {
  const { t } = useTranslation();
  const principal = sport.role === 'principal';
  const [niveau, setNiveau] = useState<Niveau | null>(sport.niveau);
  const [cadre, setCadre] = useState<Cadre>(sport.cadre_pratique);
  const [objectifId, setObjectifId] = useState<string | null>(sport.objectif_id);
  const objectifs = useObjectifs();
  const modification = useModifierSport();
  const nom = sport.sports ? libelleReferentiel('sports', { id: sport.id, ...sport.sports }) : '';

  return (
    <EcranEdition
      titre={nom}
      enregistrementActif={niveau !== null && !modification.isPending}
      onEnregistrer={() =>
        niveau &&
        modification.mutate({ id: sport.id, principal, niveau, cadre, objectifId }, { onSuccess: () => router.back() })
      }
      bandeau={modification.isError ? <ErreurEnregistrement erreur={modification.error} /> : null}>
      <GroupeChoix titre={t('inscription.etapes.niveau.titre')} radio>
        {NIVEAUX.map((n) => (
          <Chip
            key={n}
            role="radio"
            label={t(`inscription.niveau.${n}.titre`)}
            selectionne={niveau === n}
            onPress={() => setNiveau(n)}
          />
        ))}
      </GroupeChoix>
      <ChoixCadre titre={t('profil.sports.cadre')} valeur={cadre} onChange={setCadre} />
      {principal ? (
        <View style={styles.objectif}>
          <AppText variant="corpsGras" color={colors.texte2}>
            {t('inscription.etapes.objectif.titre')}
          </AppText>
          <ListeReferentiel
            requete={objectifs}
            libelle={(o) => libelleReferentiel('objectifs', o)}
            description={descriptionObjectif}
            estSelectionne={(id) => objectifId === id}
            onChoisir={setObjectifId}
          />
        </View>
      ) : null}
    </EcranEdition>
  );
}

const styles = StyleSheet.create({
  objectif: { gap: spacing.s },
});

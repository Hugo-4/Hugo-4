import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { spacing } from '@/theme/tokens';

import type { EtatSection } from '../etats';
import { libelleComparaison, memeGroupe } from '../presentation';
import { PROGRES_FICTIF } from '../source';
import type { Niveaux } from '../types';
import { CarteSection } from './CarteSection';
import { LigneNiveau } from './LigneNiveau';

type Props = {
  niveaux: Niveaux | undefined;
  etat: EtatSection;
  onReessayer: () => void;
  onPress: () => void;
  onAjouter: () => void;
};

const QUALITES_VISIBLES = 3;

/** Niveaux en percentile, toujours avec leur groupe de comparaison. */
export function CarteNiveaux({ niveaux, etat, onReessayer, onPress, onAjouter }: Props) {
  const { t } = useTranslation();
  const qualites = (niveaux?.qualites ?? []).slice(0, QUALITES_VISIBLES);
  const groupeCommun = qualites.length > 0 && qualites.every((q) => memeGroupe(q.groupe, qualites[0].groupe));

  return (
    <CarteSection
      titre={t('progres.niveaux.titre')}
      etat={etat}
      onReessayer={onReessayer}
      onPress={qualites.length ? onPress : undefined}
      exemple={PROGRES_FICTIF}>
      {qualites.map((qualite) => (
        <LigneNiveau key={qualite.qualite} qualite={qualite} afficherGroupe={!groupeCommun} />
      ))}
      {groupeCommun ? <AppText variant="libelle">{libelleComparaison(qualites[0].groupe)}</AppText> : null}
      {qualites.length === 0 ? (
        <View style={styles.vide}>
          <AppText variant="secondaire">{t('progres.niveaux.videTexte')}</AppText>
          <Button label={t('progres.tests.ajouter')} variant="secondaire" onPress={onAjouter} />
        </View>
      ) : null}
    </CarteSection>
  );
}

const styles = StyleSheet.create({
  vide: { gap: spacing.m },
});

import { LifeBuoy } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { LigneListe } from '@/components/LigneListe';
import type { EtatConsentement, Identite, SportAthlete, TypeConsentement } from '@/features/profil/types';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Offre } from '../types';
import type { ReglageManquant } from '../useReglagesManquants';
import { GroupeRubriques } from './GroupeRubriques';
import { RubriquesConfidentialite } from './RubriquesConfidentialite';
import { RubriquesMoi } from './RubriquesMoi';
import { RubriquesReglages } from './RubriquesReglages';

type Props = {
  identite: Identite | undefined;
  sports: SportAthlete[];
  consentements: Partial<Record<TypeConsentement, EtatConsentement>>;
  avecSante: boolean;
  offre: Offre | undefined;
  manquants: ReglageManquant[];
};

/** Rubriques du Profil dans l'ordre de FRONTEND.md §4.7. */
export function ListeRubriques({ identite, sports, consentements, avecSante, offre, manquants }: Props) {
  const { t } = useTranslation();
  return (
    <View style={styles.liste}>
      <RubriquesMoi identite={identite} sports={sports} manquants={manquants} />
      <RubriquesReglages offre={offre} />
      <RubriquesConfidentialite avecSante={avecSante} consentements={consentements} manquants={manquants} />
      <GroupeRubriques titre={t('parametres.profil.groupes.aide')}>
        <LigneListe
          icon={<LifeBuoy color={colors.texte2} size={sizes.icone} />}
          titre={t('parametres.profil.rubriques.aide')}
          sousTitre={t('parametres.bientot')}
        />
      </GroupeRubriques>
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.xxl },
});

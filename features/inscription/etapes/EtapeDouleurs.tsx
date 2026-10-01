import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import { spacing } from '@/theme/tokens';

import { DouleurFormulaire } from '../components/DouleurFormulaire';
import { DouleurLigne } from '../components/DouleurLigne';
import { useInscription } from '../InscriptionProvider';

/** Blessures et douleurs actuelles : posée seulement avec le consentement « données de santé ». */
export function EtapeDouleurs() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const { douleurs, aucuneDouleur } = reponses;

  return (
    <View style={styles.bloc}>
      <ChoixOption
        role="checkbox"
        titre={t('inscription.douleurs.aucune')}
        selectionne={aucuneDouleur}
        onPress={() => modifier({ aucuneDouleur: !aucuneDouleur, douleurs: aucuneDouleur ? douleurs : [] })}
      />
      {aucuneDouleur ? null : (
        <>
          {douleurs.map((douleur, i) => (
            <DouleurLigne
              key={`${douleur.zone}-${douleur.cote}-${i}`}
              douleur={douleur}
              onRetirer={() => modifier({ douleurs: douleurs.filter((_, j) => j !== i) })}
            />
          ))}
          <DouleurFormulaire onAjouter={(douleur) => modifier({ douleurs: [...douleurs, douleur] })} />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.m },
});

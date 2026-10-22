import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { ChoixOption } from '@/components/ChoixOption';
import i18n from '@/lib/i18n';
import { spacing } from '@/theme/tokens';

import { NIVEAUX, type Niveau } from '../constantes';
import { useInscription } from '../InscriptionProvider';
import { useSports } from '../useReferentiels';

/** Repère concret propre au sport (combats, chrono, FTP…), sinon la description générale du niveau. */
function repere(slug: string | undefined, niveau: Niveau): string {
  const cle = `inscription.niveauRepere.${slug}.${niveau}`;
  return slug && i18n.exists(cle)
    ? String(i18n.t(cle as never))
    : String(i18n.t(`inscription.niveau.${niveau}.description`));
}

export function EtapeNiveau() {
  const { t } = useTranslation();
  const { reponses, modifier } = useInscription();
  const sports = useSports();
  const slug = sports.data?.find((s) => s.id === reponses.sportId)?.slug;

  return (
    <View style={styles.liste} accessibilityRole="radiogroup">
      {NIVEAUX.map((niveau) => (
        <ChoixOption
          key={niveau}
          titre={t(`inscription.niveau.${niveau}.titre`)}
          description={repere(slug, niveau)}
          selectionne={reponses.niveau === niveau}
          onPress={() => modifier({ niveau })}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s },
});

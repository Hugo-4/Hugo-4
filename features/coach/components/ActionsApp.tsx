import { router } from 'expo-router';
import { ExternalLink, Languages } from 'lucide-react-native';
import { Alert, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { useChangerLangue } from '@/features/parametres/useLangue';
import { colors, sizes, spacing } from '@/theme/tokens';

import { type ActionApp, ROUTES_ECRANS } from '../actionsApp';

/**
 * Sous une réponse du coach : les actions qu'il propose sur l'app. Ouvrir un écran se fait d'un geste ;
 * changer un réglage (la langue) demande une confirmation et passe par le même enregistrement que Préférences.
 */
export function ActionsApp({ actions }: { actions: ActionApp[] }) {
  const { t } = useTranslation();
  const langue = useChangerLangue();
  if (!actions.length) return null;

  const executer = (action: ActionApp) => {
    if (action.type === 'ouvrir') return router.push(ROUTES_ECRANS[action.ecran]);
    const nom = t(`coach.actionsApp.langues.${action.langue}`);
    Alert.alert(t('coach.actionsApp.langueTitre', { langue: nom }), t('coach.actionsApp.langueTexte'), [
      { text: t('commun.annuler'), style: 'cancel' },
      { text: t('coach.actionsApp.confirmer'), onPress: () => langue.mutate(action.langue) },
    ]);
  };

  return (
    <View style={styles.liste}>
      {actions.map((action) => (
        <Button
          key={action.type === 'langue' ? `langue-${action.langue}` : `ouvrir-${action.ecran}`}
          variant="secondaire"
          icon={action.type === 'langue' ? <Languages color={colors.texte} size={sizes.icone} /> : <ExternalLink color={colors.texte} size={sizes.icone} />}
          label={
            action.type === 'langue'
              ? t('coach.actionsApp.langue', { langue: t(`coach.actionsApp.langues.${action.langue}`) })
              : t(`coach.actionsApp.ecrans.${action.ecran}`)
          }
          disabled={langue.isPending}
          onPress={() => executer(action)}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  liste: { gap: spacing.s, maxWidth: '88%' },
});

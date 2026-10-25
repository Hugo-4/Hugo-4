import { CircleAlert } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { MessageEnAttente } from '../types';
import { BulleMessage } from './BulleMessage';

type Props = {
  message: MessageEnAttente;
  onReessayer: (idClient: string) => void;
  /** Un autre message part déjà : on attend sa réponse avant de réessayer. */
  desactive: boolean;
};

/** Message de l'athlète en cours d'envoi, ou non envoyé avec « Réessayer » (le texte n'est jamais perdu). */
export function BulleEnAttente({ message, onReessayer, desactive }: Props) {
  const { t } = useTranslation();
  const echec = message.etat === 'echec';
  return (
    <View style={styles.bloc}>
      <BulleMessage role="athlete" texte={message.demande.texte} attenuee />
      {echec ? (
        <View style={styles.etat} accessibilityLiveRegion="polite">
          <CircleAlert color={colors.alerte} size={sizes.iconePetite} />
          <AppText variant="libelle" color={colors.alerte}>
            {t('coach.message.nonEnvoye')}
          </AppText>
          <Button
            label={t('commun.reessayer')}
            variant="secondaire"
            disabled={desactive}
            onPress={() => onReessayer(message.demande.id_client)}
          />
        </View>
      ) : (
        <AppText variant="libelle" style={styles.envoi}>
          {t('coach.message.envoiEnCours')}
        </AppText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.xs },
  etat: { flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: spacing.s },
  envoi: { alignSelf: 'flex-end' },
});

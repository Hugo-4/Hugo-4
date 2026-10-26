import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/tokens';

import type { MessageConversation } from '../types';
import { ActionsApp } from './ActionsApp';
import { BoutonsAvis } from './BoutonsAvis';
import { BulleMessage } from './BulleMessage';
import { PropositionMessage } from './PropositionMessage';

/** Un message de la conversation ; sous une réponse du coach : sa proposition, ses actions sur l'app, 👍 / 👎. */
export function ElementMessage({ message }: { message: MessageConversation }) {
  if (message.role === 'athlete') return <BulleMessage role="athlete" texte={message.contenu} />;
  return (
    <View style={styles.coach}>
      <BulleMessage role="coach" texte={message.contenu} />
      {message.proposition ? <PropositionMessage proposition={message.proposition} /> : null}
      <ActionsApp actions={message.actionsApp} />
      <BoutonsAvis messageId={message.id} avis={message.avis} />
    </View>
  );
}

const styles = StyleSheet.create({
  coach: { gap: spacing.s },
});

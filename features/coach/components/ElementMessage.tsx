import { StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/tokens';

import type { MessageConversation } from '../types';
import { BoutonsAvis } from './BoutonsAvis';
import { BulleMessage } from './BulleMessage';
import { PropositionMessage } from './PropositionMessage';

/** Un message de la conversation ; sous une réponse du coach : sa proposition éventuelle et 👍 / 👎. */
export function ElementMessage({ message }: { message: MessageConversation }) {
  if (message.role === 'athlete') return <BulleMessage role="athlete" texte={message.contenu} />;
  return (
    <View style={styles.coach}>
      <BulleMessage role="coach" texte={message.contenu} />
      {message.proposition ? <PropositionMessage proposition={message.proposition} /> : null}
      <BoutonsAvis messageId={message.id} avis={message.avis} />
    </View>
  );
}

const styles = StyleSheet.create({
  coach: { gap: spacing.s },
});

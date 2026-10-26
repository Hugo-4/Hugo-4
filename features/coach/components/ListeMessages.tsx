import { FlatList, StyleSheet, View } from 'react-native';

import { spacing } from '@/theme/tokens';

import type { MessageConversation, MessageEnAttente } from '../types';
import { BulleEnAttente } from './BulleEnAttente';
import { ElementMessage } from './ElementMessage';
import { ReponseEnCours } from './ReponseEnCours';

type Element = { type: 'message'; message: MessageConversation } | { type: 'attente'; message: MessageEnAttente };

type Props = {
  messages: MessageConversation[];
  enAttente: MessageEnAttente[];
  enCours: boolean;
  fragment: string | null;
  onReessayer: (idClient: string) => void;
};

const cle = (e: Element) => (e.type === 'message' ? e.message.id : `attente-${e.message.demande.id_client}`);

function Separateur() {
  return <View style={styles.separateur} />;
}

/**
 * Conversation, la plus récente en bas (liste inversée : elle reste collée au dernier message).
 * Les messages pas encore confirmés suivent la conversation, puis la réponse en préparation.
 */
export function ListeMessages({ messages, enAttente, enCours, fragment, onReessayer }: Props) {
  const elements: Element[] = [
    ...messages.map((message) => ({ type: 'message' as const, message })),
    ...enAttente.map((message) => ({ type: 'attente' as const, message })),
  ].reverse();

  return (
    <FlatList
      inverted
      data={elements}
      keyExtractor={cle}
      renderItem={({ item }) =>
        item.type === 'message' ? (
          <ElementMessage message={item.message} />
        ) : (
          <BulleEnAttente message={item.message} onReessayer={onReessayer} desactive={enCours} />
        )
      }
      ItemSeparatorComponent={Separateur}
      ListHeaderComponent={enCours ? <ReponseEnCours fragment={fragment} /> : undefined}
      ListHeaderComponentStyle={enCours ? styles.reponse : undefined}
      contentContainerStyle={styles.contenu}
      keyboardShouldPersistTaps="handled"
      keyboardDismissMode="interactive"
    />
  );
}

const styles = StyleSheet.create({
  contenu: { paddingVertical: spacing.m },
  separateur: { height: spacing.l },
  reponse: { paddingTop: spacing.l },
});

import { KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { Screen } from '@/components/Screen';

import { useChatCoach } from '../useChatCoach';
import { BasCoach } from './BasCoach';
import { EnTeteCoach } from './EnTeteCoach';
import { ZoneMessages } from './ZoneMessages';

/**
 * Coach (FRONTEND.md §4.4, ECRANS.md §3) : « Je veux changer quelque chose ».
 * En-tête (retour, contexte, crédits), conversation, puis réponses rapides et saisie sous le pouce.
 * La saisie n'apparaît qu'une fois la conversation connue (sinon un nouveau fil serait ouvert par erreur).
 */
export function EcranCoach() {
  const chat = useChatCoach();
  const pret = Boolean(chat.conversation.data);
  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <EnTeteCoach
          contexte={chat.contexte}
          credits={chat.credits}
          onRetour={chat.retour}
          onRetirerContexte={chat.retirerContexte}
        />
        <ZoneMessages chat={chat} />
        {pret ? <BasCoach chat={chat} /> : null}
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
});

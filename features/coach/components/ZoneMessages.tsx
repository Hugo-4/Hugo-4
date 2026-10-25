import { CloudOff, MessageCircle } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EmptyState } from '@/components/EmptyState';
import { EtatsEcran } from '@/components/EtatsEcran';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { ChatCoach } from '../useChatCoach';
import { BandeauUrgence } from './BandeauUrgence';
import { ListeMessages } from './ListeMessages';
import { SqueletteMessages } from './SqueletteMessages';

/**
 * Zone des messages et ses 5 états : chargement (squelette), erreur (Réessayer), vide (explication ; les
 * réponses rapides restent dessous), hors ligne (bandeau + historique en cache), normal.
 */
export function ZoneMessages({ chat }: { chat: ChatCoach }) {
  const { t } = useTranslation();
  const { conversation } = chat;
  const grandeIcone = sizes.icone * 2;

  if (chat.horsLigneSansDonnees) {
    return (
      <View style={styles.zone}>
        <EmptyState
          icon={<CloudOff color={colors.discret} size={grandeIcone} />}
          titre={t('coach.horsLigne.titre')}
          texte={t('coach.horsLigne.texte')}
        />
      </View>
    );
  }

  return (
    <View style={styles.zone}>
      <EtatsEcran
        chargement={conversation.isPending}
        erreur={conversation.error}
        aDesDonnees={Boolean(conversation.data)}
        vide={chat.vide}
        onReessayer={() => conversation.refetch()}
        squelette={<SqueletteMessages />}
        etatVide={{
          icon: <MessageCircle color={colors.discret} size={grandeIcone} />,
          titre: t('coach.vide.titre'),
          texte: t('coach.vide.texte'),
        }}>
        {chat.urgence ? <BandeauUrgence /> : null}
        <ListeMessages
          messages={chat.messages}
          enAttente={chat.enAttente}
          enCours={chat.enCours}
          fragment={chat.fragment}
          onReessayer={chat.reessayer}
        />
      </EtatsEcran>
    </View>
  );
}

const styles = StyleSheet.create({
  zone: { flex: 1, paddingHorizontal: spacing.ecran },
});

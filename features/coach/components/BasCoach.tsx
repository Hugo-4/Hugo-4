import { StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { colors, sizes, spacing } from '@/theme/tokens';

import type { ChatCoach } from '../useChatCoach';
import { useClavierVisible } from '../useClavierVisible';
import { creditsBas, creditsEpuises } from '../useCredits';
import { BlocCreditsEpuises } from './BlocCreditsEpuises';
import { LigneCredits } from './LigneCredits';
import { ReponsesRapides } from './ReponsesRapides';
import { SaisieMessage } from './SaisieMessage';

/** Bas de l'écran (sous le pouce) : crédits bas, réponses rapides, saisie ; ou l'explication si plus de crédits. */
export function BasCoach({ chat }: { chat: ChatCoach }) {
  const insets = useSafeAreaInsets();
  const clavier = useClavierVisible();
  const { credits } = chat;
  // La barre d'onglets est masquée sur le Coach : la marge du bas de l'écran est gérée ici.
  const basEcran = clavier ? spacing.s : Math.max(insets.bottom, spacing.s);

  if (creditsEpuises(credits) && credits) {
    return (
      <View style={[styles.bas, styles.marge, { paddingBottom: basEcran }]}>
        <BlocCreditsEpuises credits={credits} />
      </View>
    );
  }

  return (
    <View style={[styles.bas, { paddingBottom: basEcran }]}>
      {credits && creditsBas(credits) ? (
        <View style={styles.marge}>
          <LigneCredits credits={credits} />
        </View>
      ) : null}
      <ReponsesRapides
        codes={chat.reponsesRapides}
        desactive={chat.enCours}
        onChoisir={(code, texte) => chat.envoyer({ texte, reponseRapide: code })}
      />
      <SaisieMessage envoiBloque={chat.enCours} onEnvoyer={(texte) => chat.envoyer({ texte })} />
    </View>
  );
}

const styles = StyleSheet.create({
  bas: {
    gap: spacing.xs,
    paddingTop: spacing.s,
    borderTopWidth: sizes.bordure,
    borderTopColor: colors.ligne,
    backgroundColor: colors.fond,
  },
  marge: { paddingHorizontal: spacing.ecran },
});

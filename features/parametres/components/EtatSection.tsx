import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Skeleton } from '@/components/Skeleton';
import { MessageErreur } from '@/features/auth/components/MessageErreur';
import { useTexteErreur } from '@/lib/texteErreur';
import { sizes, spacing } from '@/theme/tokens';

type Props = {
  chargement: boolean;
  erreur: unknown;
  aDesDonnees: boolean;
  onReessayer: () => void;
  /** Nombre de lignes du squelette. */
  lignes?: number;
  children: ReactNode;
};

/**
 * États d'une partie d'écran qui a sa propre source (le bandeau hors ligne est déjà affiché par
 * l'écran) : squelette, erreur courte avec « Réessayer », contenu (même ancien, s'il est en cache).
 */
export function EtatSection({ chargement, erreur, aDesDonnees, onReessayer, lignes = 2, children }: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  if (!aDesDonnees && chargement) {
    return (
      <View style={styles.bloc}>
        {Array.from({ length: lignes }, (_, i) => (
          <Skeleton key={i} hauteur={sizes.pasAPas} />
        ))}
      </View>
    );
  }
  if (!aDesDonnees && erreur) {
    return (
      <View style={styles.bloc}>
        <MessageErreur texte={texteErreur(erreur) ?? t('parametres.erreurSection')} />
        <Button label={t('commun.reessayer')} variant="secondaire" onPress={onReessayer} />
      </View>
    );
  }
  return <>{children}</>;
}

const styles = StyleSheet.create({
  bloc: { gap: spacing.s },
});

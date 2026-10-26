import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';

import { useEnLigne } from '@/lib/useEnLigne';
import { spacing } from '@/theme/tokens';

import { BandeauHorsLigne } from './BandeauHorsLigne';
import { EmptyState } from './EmptyState';
import { ErrorState } from './ErrorState';
import { EtatHorsLigne } from './EtatHorsLigne';

type Props = {
  /** Aucune donnée encore reçue (premier chargement). */
  chargement: boolean;
  erreur: unknown;
  /** Des données sont là (même anciennes) : on les affiche, avec le bandeau si hors ligne. */
  aDesDonnees: boolean;
  vide?: boolean;
  onReessayer: () => void;
  squelette: ReactNode;
  etatVide?: { icon: ReactNode; titre: string; texte: string; action?: ReactNode };
  children: ReactNode;
};

/**
 * Les 5 états d'un écran (FRONTEND.md §2.7) : chargement (squelette), erreur (Réessayer),
 * vide (explication + action), hors ligne (bandeau + données en cache), normal.
 */
export function EtatsEcran({ chargement, erreur, aDesDonnees, vide, onReessayer, squelette, etatVide, children }: Props) {
  const enLigne = useEnLigne();
  if (!aDesDonnees) {
    // Hors ligne, la requête reste en pause : sans cache, on le dit au lieu d'un squelette sans fin.
    if (chargement && !enLigne) return <EtatHorsLigne onRetry={onReessayer} />;
    if (chargement) return <>{squelette}</>;
    if (erreur) return <ErrorState onRetry={onReessayer} erreur={erreur} />;
  }
  return (
    <View style={styles.bloc}>
      <BandeauHorsLigne />
      {vide && etatVide ? (
        <View style={styles.vide}>
          <EmptyState icon={etatVide.icon} titre={etatVide.titre} texte={etatVide.texte} />
          {etatVide.action}
        </View>
      ) : (
        children
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  bloc: { flex: 1, gap: spacing.m },
  vide: { flex: 1, gap: spacing.l, justifyContent: 'center' },
});

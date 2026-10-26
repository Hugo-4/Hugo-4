import type { FetchStatus } from '@tanstack/react-query';
import { CloudOff } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { colors, sizes, spacing } from '@/theme/tokens';

import { etatsEcran } from '../etats';
import { useRafraichir } from '../useRafraichir';
import { ProgresSkeleton } from './ProgresSkeleton';

type Props = {
  titre: string;
  sousTitre?: string;
  /** Requête principale de la vue : elle pilote les 5 états. */
  requete: { data: unknown; isError: boolean; isPending: boolean; error: unknown; fetchStatus: FetchStatus; refetch: () => unknown };
  vide?: boolean;
  etatVide?: { icon: ReactNode; titre: string; texte: string; action?: ReactNode };
  /** Action principale en bas de l'écran (zone du pouce), masquée tant qu'il n'y a rien à afficher. */
  pied?: ReactNode;
  /** Par-dessus le contenu (ex. message de confirmation). */
  superpose?: ReactNode;
  children: ReactNode;
};

/** Cadre d'une vue de Progrès (niveaux 2 et 3) : en-tête, tirer pour rafraîchir, 5 états, action en bas. */
export function CadreVue({ titre, sousTitre, requete, vide, etatVide, pied, superpose, children }: Props) {
  const { t } = useTranslation();
  const { rafraichir, rafraichissement } = useRafraichir();
  const etats = etatsEcran(requete);
  const etatHorsLigne = {
    icon: <CloudOff color={colors.discret} size={sizes.icone * 2} />,
    titre: t('progres.etats.horsLigneTitre'),
    texte: t('progres.etats.horsLigneTexte'),
  };
  const afficherPied = pied && requete.data !== undefined && !vide;

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <EnTete titre={titre} sousTitre={sousTitre} />
      <ScrollView
        contentContainerStyle={styles.contenu}
        refreshControl={<RefreshControl refreshing={rafraichissement} onRefresh={rafraichir} tintColor={colors.accent} />}>
        <EtatsEcran
          chargement={etats.chargement}
          erreur={etats.erreur}
          aDesDonnees={etats.aDesDonnees}
          vide={etats.horsLigneSansDonnees || vide}
          onReessayer={() => requete.refetch()}
          squelette={<ProgresSkeleton blocs={3} />}
          etatVide={etats.horsLigneSansDonnees ? etatHorsLigne : etatVide}>
          {children}
        </EtatsEcran>
      </ScrollView>
      {afficherPied ? <View style={styles.pied}>{pied}</View> : null}
      {superpose}
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { flexGrow: 1, padding: spacing.ecran, gap: spacing.entreCartes },
  pied: { paddingHorizontal: spacing.ecran, paddingVertical: spacing.s },
});

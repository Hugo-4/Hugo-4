import { History } from 'lucide-react-native';
import { FlatList, RefreshControl, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { AdaptationLigne } from '@/features/programme/components/AdaptationLigne';
import { useEcranAdaptations } from '@/features/programme/useEcranAdaptations';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

/** Historique des adaptations du programme (30 derniers jours). */
export default function AdaptationsScreen() {
  const { t } = useTranslation();
  const e = useEcranAdaptations();

  return (
    <Screen edges={['top', 'left', 'right', 'bottom']}>
      <EnTete titre={t('programme.adaptations.titre')} />
      <EtatsEcran
        chargement={e.chargement}
        erreur={e.erreur}
        aDesDonnees={e.aDesDonnees}
        vide={e.adaptations.length === 0}
        onReessayer={e.rafraichir}
        squelette={
          <View style={styles.squelette}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} hauteur={sizes.anneauForme} arrondi={radius.carte} />
            ))}
          </View>
        }
        etatVide={{
          icon: <History color={colors.discret} size={sizes.icone * 2} />,
          titre: t('programme.adaptations.videTitre'),
          texte: t('programme.adaptations.videTexte'),
        }}>
        <FlatList
          data={e.adaptations}
          keyExtractor={(a) => a.id}
          renderItem={({ item }) => <AdaptationLigne adaptation={item} />}
          ListHeaderComponent={<AppText variant="secondaire">{t('programme.adaptations.periode')}</AppText>}
          contentContainerStyle={styles.liste}
          refreshControl={<RefreshControl refreshing={e.rafraichissement} onRefresh={e.rafraichir} tintColor={colors.accent} />}
        />
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  squelette: { padding: spacing.ecran, gap: spacing.entreCartes },
  liste: { padding: spacing.ecran, gap: spacing.entreCartes },
});

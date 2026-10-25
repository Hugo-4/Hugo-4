import { ChevronRight } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Skeleton } from '@/components/Skeleton';
import { colors, opacity, sizes, spacing } from '@/theme/tokens';

import type { EtatSection } from '../etats';
import { BadgeExemple } from './BadgeExemple';

type Props = {
  titre: string;
  etat: EtatSection;
  onReessayer: () => void;
  /** Ouvre la vue de la carte (niveau 2) ; toute la carte est tactile quand les données sont là. */
  onPress?: () => void;
  /** Données de la source fictive : étiquette « Exemple ». */
  exemple?: boolean;
  children: ReactNode;
};

/** Carte de la vue d'ensemble : titre, état propre (chargement, erreur, hors ligne) et contenu. */
export function CarteSection({ titre, etat, onReessayer, onPress, exemple, children }: Props) {
  const { t } = useTranslation();
  const ouvrable = etat === 'pret' && onPress !== undefined;

  const contenu = (
    <Card>
      <View style={styles.entete}>
        <AppText variant="surTitre" style={styles.titre}>
          {titre}
        </AppText>
        {exemple ? <BadgeExemple /> : null}
        {ouvrable ? <ChevronRight color={colors.discret} size={sizes.icone} /> : null}
      </View>
      {etat === 'pret' ? children : null}
      {etat === 'chargement' ? (
        <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants">
          <Skeleton hauteur={sizes.graphique / 2} />
        </View>
      ) : null}
      {etat === 'horsLigne' ? <AppText variant="secondaire">{t('progres.etats.horsLigneSection')}</AppText> : null}
      {etat === 'erreur' ? (
        <View style={styles.erreur} accessibilityRole="alert">
          <AppText variant="secondaire" style={styles.titre}>
            {t('progres.etats.erreurSection')}
          </AppText>
          <Button label={t('commun.reessayer')} variant="secondaire" onPress={onReessayer} />
        </View>
      ) : null}
    </Card>
  );

  if (!ouvrable) return contenu;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityHint={t('progres.ouvrir')}
      onPress={onPress}
      style={({ pressed }) => (pressed ? styles.presse : null)}>
      {contenu}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s, minHeight: sizes.icone },
  titre: { flex: 1 },
  erreur: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  presse: { opacity: opacity.presse },
});

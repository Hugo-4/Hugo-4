import { Check, Trophy, X } from 'lucide-react-native';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { libelleType } from '@/features/accueil/presentation';
import { dateLocale, formatDateLongue } from '@/lib/format';
import { colors, opacity, radius, sizes, spacing } from '@/theme/tokens';

import { etatJour, libelleIntensite, libelleStatutSeance, type StatutCase } from '../presentation';
import type { JourCalendrier, Legende } from '../types';
import { IntensiteTraits } from './IntensiteTraits';

type Props = {
  date: string;
  jour: JourCalendrier | undefined;
  legende?: Legende;
  onPress: (jour: JourCalendrier) => void;
};

/** Le numéro grossit avec la taille de texte du téléphone, sans sortir de la pastille (FRONTEND.md §5.2). */
const MULTIPLICATEUR_MAX = 1.3;

const APPARENCES: Record<StatutCase, { fond: string; bordure: string; texte: string }> = {
  fait: { fond: colors.accent, bordure: colors.accent, texte: colors.surAccent },
  prevu: { fond: 'transparent', bordure: colors.discret, texte: colors.texte },
  manque: { fond: 'transparent', bordure: colors.alerte, texte: colors.alerte },
  vide: { fond: 'transparent', bordure: 'transparent', texte: colors.discret },
};

/**
 * Une case du calendrier : numéro du jour dans une pastille (pleine = faite, contour = prévue,
 * contour orange = manquée), et dessous une icône (coche, croix, trophée) ou l'intensité en traits.
 * Aujourd'hui : contour épais et numéro souligné. Le lecteur d'écran lit tout le contenu du jour.
 */
export function CaseJour({ date, jour, legende, onPress }: Props) {
  const { t } = useTranslation();
  const etat = jour ? etatJour(jour) : null;
  const statut = etat?.statut ?? 'vide';
  const apparence = APPARENCES[statut];
  const aujourdhui = jour?.aujourdhui === true;
  const touchable = !!jour && (jour.seances.length > 0 || jour.evenements.length > 0);

  const morceaux = [formatDateLongue(dateLocale(date))];
  if (aujourdhui) morceaux.push(t('programme.calendrier.aujourdhui'));
  for (const s of jour?.seances ?? []) {
    morceaux.push(
      t('programme.calendrier.a11ySeance', {
        titre: s.titre || libelleType(s.type),
        statut: libelleStatutSeance(s.statut),
        niveau: s.intensite.niveau,
        intensite: libelleIntensite(s.intensite.niveau, legende),
      }),
    );
  }
  for (const e of jour?.evenements ?? []) morceaux.push(t('programme.calendrier.a11yCompetition', { nom: e.nom, priorite: e.priorite }));
  if (!touchable) morceaux.push(t('programme.calendrier.rienDePrevu'));

  return (
    <Pressable
      disabled={!touchable}
      accessibilityRole={touchable ? 'button' : 'text'}
      accessibilityLabel={morceaux.join(', ')}
      accessibilityHint={touchable ? t('programme.calendrier.a11yOuvrir') : undefined}
      onPress={() => jour && onPress(jour)}
      style={({ pressed }) => [styles.case, pressed && styles.presse]}>
      <View
        style={[
          styles.pastille,
          {
            backgroundColor: apparence.fond,
            borderColor: aujourdhui && statut !== 'fait' ? colors.accent : apparence.bordure,
            borderWidth: aujourdhui ? sizes.bordureForte : sizes.bordure,
          },
        ]}>
        <AppText
          variant="corpsGras"
          color={apparence.texte}
          maxFontSizeMultiplier={MULTIPLICATEUR_MAX}
          style={aujourdhui ? styles.souligne : undefined}>
          {Number(date.slice(8, 10))}
        </AppText>
      </View>
      <View style={styles.indice}>
        {etat?.competition ? (
          <Trophy color={colors.accent} size={sizes.iconePetite} />
        ) : statut === 'fait' ? (
          <Check color={colors.accent} size={sizes.iconePetite} />
        ) : statut === 'manque' ? (
          <X color={colors.alerte} size={sizes.iconePetite} />
        ) : etat?.intensite ? (
          <IntensiteTraits niveau={etat.intensite} />
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  case: { flex: 1, alignItems: 'center', gap: spacing.xs, paddingVertical: spacing.xs, minHeight: sizes.pasAPas },
  presse: { opacity: opacity.presse },
  pastille: {
    width: sizes.pastilleJour,
    height: sizes.pastilleJour,
    borderRadius: radius.rond,
    alignItems: 'center',
    justifyContent: 'center',
  },
  souligne: { textDecorationLine: 'underline' },
  indice: { height: sizes.iconePetite, justifyContent: 'center' },
});

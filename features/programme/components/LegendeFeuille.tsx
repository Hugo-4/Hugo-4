import { Check, Circle, Trophy, X } from 'lucide-react-native';
import type { ReactNode } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Feuille } from '@/components/Feuille';
import { colors, sizes, spacing } from '@/theme/tokens';

import { libelleIntensite } from '../presentation';
import type { Legende } from '../types';
import { IntensiteTraits } from './IntensiteTraits';

type Props = { visible: boolean; legende?: Legende; onFermer: () => void };

const NIVEAUX = [1, 2, 3, 4, 5];

function Ligne({ symbole, texte }: { symbole: ReactNode; texte: string }) {
  return (
    <View style={styles.ligne} accessible accessibilityLabel={texte}>
      <View style={styles.symbole}>{symbole}</View>
      <AppText variant="corps" style={styles.texte}>
        {texte}
      </AppText>
    </View>
  );
}

/** Ce que veulent dire les pastilles du calendrier ; intensités et RPE repris de `GET /calendrier/legende`. */
export function LegendeFeuille({ visible, legende, onFermer }: Props) {
  const { t } = useTranslation();
  return (
    <Feuille visible={visible} titre={t('programme.legende.titre')} onFermer={onFermer}>
      <Ligne symbole={<Check color={colors.accent} size={sizes.icone} />} texte={t('programme.legende.fait')} />
      <Ligne symbole={<Circle color={colors.discret} size={sizes.icone} />} texte={t('programme.legende.prevu')} />
      <Ligne symbole={<X color={colors.alerte} size={sizes.icone} />} texte={t('programme.legende.manque')} />
      <Ligne symbole={<Trophy color={colors.accent} size={sizes.icone} />} texte={t('programme.legende.competition')} />
      <Ligne symbole={<Circle color={colors.accent} size={sizes.icone} />} texte={t('programme.legende.aujourdhui')} />
      <AppText variant="surTitre" accessibilityRole="header">
        {t('programme.legende.intensite')}
      </AppText>
      {NIVEAUX.map((niveau) => {
        const rpe = legende?.intensites.find((i) => i.niveau === niveau)?.rpe;
        const libelle = libelleIntensite(niveau, legende);
        return (
          <Ligne
            key={niveau}
            symbole={<IntensiteTraits niveau={niveau} />}
            texte={rpe ? t('programme.legende.niveauRpe', { niveau, libelle, rpe }) : t('programme.legende.niveau', { niveau, libelle })}
          />
        );
      })}
    </Feuille>
  );
}

const styles = StyleSheet.create({
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m, minHeight: sizes.cibleTactile },
  symbole: { width: sizes.cibleTactile, alignItems: 'center' },
  texte: { flex: 1 },
});

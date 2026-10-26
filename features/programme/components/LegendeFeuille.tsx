import { Check, Circle, Trophy, X } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Feuille } from '@/components/Feuille';
import { colors, sizes } from '@/theme/tokens';

import { ICONES_TYPE } from '../iconesType';
import { libelleIntensite, libelleTypeSeance } from '../presentation';
import type { Legende } from '../types';
import { IntensiteTraits } from './IntensiteTraits';
import { LigneLegende } from './LigneLegende';

type Props = { visible: boolean; legende?: Legende; onFermer: () => void };

const NIVEAUX = [1, 2, 3, 4, 5];

/** Ce que veulent dire les pastilles du calendrier ; types, intensités et RPE repris de `GET /calendrier/legende`. */
export function LegendeFeuille({ visible, legende, onFermer }: Props) {
  const { t } = useTranslation();
  return (
    <Feuille visible={visible} titre={t('programme.legende.titre')} onFermer={onFermer}>
      <LigneLegende symbole={<Check color={colors.accent} size={sizes.icone} />} texte={t('programme.legende.fait')} />
      <LigneLegende symbole={<Circle color={colors.discret} size={sizes.icone} />} texte={t('programme.legende.prevu')} />
      <LigneLegende symbole={<X color={colors.alerte} size={sizes.icone} />} texte={t('programme.legende.manque')} />
      <LigneLegende symbole={<Trophy color={colors.accent} size={sizes.icone} />} texte={t('programme.legende.competition')} />
      <LigneLegende symbole={<Circle color={colors.accent} size={sizes.icone} />} texte={t('programme.legende.aujourdhui')} />
      <AppText variant="surTitre" accessibilityRole="header">
        {t('programme.legende.types')}
      </AppText>
      {Object.entries(ICONES_TYPE).map(([code, Icone]) => (
        <LigneLegende key={code} symbole={<Icone color={colors.texte2} size={sizes.icone} />} texte={libelleTypeSeance(code, legende)} />
      ))}
      <AppText variant="surTitre" accessibilityRole="header">
        {t('programme.legende.intensite')}
      </AppText>
      {NIVEAUX.map((niveau) => {
        const rpe = legende?.intensites.find((i) => i.niveau === niveau)?.rpe;
        const libelle = libelleIntensite(niveau, legende);
        return (
          <LigneLegende
            key={niveau}
            symbole={<IntensiteTraits niveau={niveau} />}
            texte={rpe ? t('programme.legende.niveauRpe', { niveau, libelle, rpe }) : t('programme.legende.niveau', { niveau, libelle })}
          />
        );
      })}
    </Feuille>
  );
}

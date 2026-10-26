import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import { formatValeur } from '../format';
import type { ChargeActuelle } from '../types';

type Mesure = { titre: string; valeur: string | null; texte: string };

/** Ce que veulent dire la charge, le rapport charge récente / habituelle (ACWR) et la monotonie, en mots simples. */
export function ExplicationCharge({ actuelle, unite }: { actuelle: ChargeActuelle | null | undefined; unite: string }) {
  const { t } = useTranslation();
  const valeurs = actuelle?.donnees_suffisantes ? actuelle : null;
  const mesures: Mesure[] = [
    {
      titre: t('progres.charge.aigue'),
      valeur: actuelle?.aigue_7j != null ? formatValeur(actuelle.aigue_7j, unite) : null,
      texte: t('progres.charge.explicationCharge'),
    },
    {
      titre: t('progres.charge.acwr'),
      valeur: valeurs?.acwr != null ? formatNombre(valeurs.acwr, 2) : null,
      texte: t('progres.charge.acwrTexte', {
        chronique: valeurs?.chronique_hebdo_28j != null ? formatValeur(valeurs.chronique_hebdo_28j, unite) : '—',
      }),
    },
    {
      titre: t('progres.charge.monotonie'),
      valeur: valeurs?.monotonie != null ? formatNombre(valeurs.monotonie, 1) : null,
      texte: t('progres.charge.monotonieTexte'),
    },
  ];

  return (
    <Card>
      <AppText variant="surTitre">{t('progres.charge.comprendre')}</AppText>
      {mesures.map((m) => (
        <View key={m.titre} style={styles.mesure} accessible>
          <View style={styles.ligne}>
            <AppText variant="corpsGras" style={styles.titre}>
              {m.titre}
            </AppText>
            <AppText variant="chiffre">{m.valeur ?? '—'}</AppText>
          </View>
          <AppText variant="secondaire">{m.texte}</AppText>
        </View>
      ))}
      {actuelle && !actuelle.donnees_suffisantes ? (
        <AppText variant="libelle">
          {t('progres.charge.insuffisantJours', { count: actuelle.jours_actifs_28j ?? 0 })}
        </AppText>
      ) : null}
    </Card>
  );
}

const styles = StyleSheet.create({
  mesure: { gap: spacing.xs },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  titre: { flex: 1 },
});

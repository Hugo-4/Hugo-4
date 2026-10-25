import { CheckCircle2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { colors, sizes, spacing } from '@/theme/tokens';

import { AppText } from './AppText';
import { Button } from './Button';
import { Card } from './Card';

export type EtatModification = 'proposee' | 'appliquee' | 'gardee';

type Props = {
  titre?: string;
  avant: string[];
  apres: string[];
  inchange: string[];
  etat: EtatModification;
  /** Secondes restantes pour annuler après « Appliquer » (0 : plus d'annulation). */
  annulationRestante?: number;
  enCours?: boolean;
  onAppliquer: () => void;
  onGarder: () => void;
  onAnnuler?: () => void;
};

/** Proposition du coach : avant (barré) / après / ce qui ne change pas, Appliquer ou Garder l'original. */
export function CarteModification(p: Props) {
  const { t } = useTranslation();
  const ligne = (texte: string, barre = false) => (
    <AppText key={texte} variant="corps" style={barre ? styles.barre : undefined} color={barre ? colors.discret : colors.texte}>
      {texte}
    </AppText>
  );
  return (
    <Card borderColor={p.etat === 'proposee' ? colors.accent : undefined}>
      {p.titre ? <AppText variant="sousTitre">{p.titre}</AppText> : null}
      <View style={styles.groupe} accessibilityLabel={t('commun.modification.a11yAvant', { liste: p.avant.join(', ') })}>
        <AppText variant="surTitre">{t('commun.modification.avant')}</AppText>
        {p.avant.map((x) => ligne(x, true))}
      </View>
      <View style={styles.groupe}>
        <AppText variant="surTitre" color={colors.accent}>
          {t('commun.modification.apres')}
        </AppText>
        {p.apres.map((x) => ligne(x))}
      </View>
      {p.inchange.length ? (
        <View style={styles.groupe}>
          <AppText variant="surTitre">{t('commun.modification.inchange')}</AppText>
          {p.inchange.map((x) => (
            <AppText key={x} variant="secondaire">
              {x}
            </AppText>
          ))}
        </View>
      ) : null}
      {p.etat === 'proposee' ? (
        <View style={styles.boutons}>
          <Button label={t('commun.modification.appliquer')} onPress={p.onAppliquer} disabled={p.enCours} />
          <Button label={t('commun.modification.garder')} variant="secondaire" onPress={p.onGarder} disabled={p.enCours} />
        </View>
      ) : (
        <View style={styles.statut}>
          <CheckCircle2 color={p.etat === 'appliquee' ? colors.accent : colors.discret} size={sizes.icone} />
          <AppText variant="corpsGras" style={styles.flex}>
            {t(p.etat === 'appliquee' ? 'commun.modification.appliquee' : 'commun.modification.gardee')}
          </AppText>
          {p.etat === 'appliquee' && p.onAnnuler && (p.annulationRestante ?? 0) > 0 ? (
            <Button
              label={t('commun.modification.annuler', { secondes: p.annulationRestante })}
              variant="discret"
              onPress={p.onAnnuler}
            />
          ) : null}
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  groupe: { gap: spacing.xs },
  barre: { textDecorationLine: 'line-through' },
  boutons: { gap: spacing.s },
  statut: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  flex: { flex: 1 },
});

import { CheckCircle2 } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatNombre } from '@/lib/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Resume } from '../resume';

/** Résumé : volume, séries faites / prévues, durée. Les records arriveront avec les réponses du serveur. */
export function ResumeFin({ resume, onTerminer }: { resume: Resume; onTerminer: () => void }) {
  const { t } = useTranslation();
  const lignes = [
    { libelle: t('enSeance.resume.volume'), valeur: t('enSeance.kg', { valeur: formatNombre(resume.volumeKg) }) },
    { libelle: t('enSeance.resume.series'), valeur: `${resume.seriesFaites} / ${resume.seriesPrevues}` },
    { libelle: t('enSeance.resume.duree'), valeur: t('enSeance.minutes', { valeur: resume.dureeMin }) },
  ];
  return (
    <View style={styles.ecran}>
      <View style={styles.contenu}>
        <CheckCircle2 color={colors.accent} size={sizes.icone * 3} />
        <AppText variant="titre" accessibilityRole="header">
          {t('enSeance.resume.titre')}
        </AppText>
        <Card style={styles.carte}>
          {lignes.map((l) => (
            <View key={l.libelle} style={styles.ligne}>
              <AppText variant="secondaire">{l.libelle}</AppText>
              <AppText variant="chiffre">{l.valeur}</AppText>
            </View>
          ))}
        </Card>
        <AppText variant="libelle">{t('enSeance.resume.envoi')}</AppText>
      </View>
      <View style={styles.bas}>
        <Button label={t('enSeance.resume.terminer')} onPress={onTerminer} style={styles.bouton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1 },
  contenu: { flex: 1, padding: spacing.ecran, gap: spacing.l, alignItems: 'center', justifyContent: 'center' },
  carte: { alignSelf: 'stretch' },
  ligne: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  bas: { paddingHorizontal: spacing.ecran, paddingBottom: spacing.s },
  bouton: { minHeight: sizes.boutonSeance },
});

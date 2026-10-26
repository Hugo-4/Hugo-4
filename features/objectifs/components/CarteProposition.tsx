import { router } from 'expo-router';
import { Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { formatDateJour } from '@/features/progres/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import { formatValeurEtape } from '../format';
import type { SousObjectif } from '../types';

type Props = {
  etape: SousObjectif;
  enCours: boolean;
  onAccepter: () => void;
  onRefuser: () => void;
};

/** Étape proposée par le coach : sa raison, puis Accepter, Modifier (formulaire) ou Refuser. */
export function CarteProposition({ etape, enCours, onAccepter, onRefuser }: Props) {
  const { t } = useTranslation();
  return (
    <Card borderColor={colors.accent}>
      <View style={styles.entete}>
        <Sparkles color={colors.accent} size={sizes.icone} />
        <AppText variant="surTitre" color={colors.accent}>
          {t('objectifs.proposeeParCoach')}
        </AppText>
      </View>
      <AppText variant="sousTitre">{etape.titre}</AppText>
      <AppText variant="secondaire">
        {[
          formatDateJour(etape.date_cible),
          etape.valeur_cible !== null ? t('objectifs.cible', { valeur: formatValeurEtape(t, etape.valeur_cible, etape.unite) }) : null,
        ]
          .filter(Boolean)
          .join(' · ')}
      </AppText>
      {etape.raison ? <AppText variant="corps">{etape.raison}</AppText> : null}
      <View style={styles.boutons}>
        <Button label={t('objectifs.accepter')} onPress={onAccepter} disabled={enCours} />
        <Button
          label={t('objectifs.modifier')}
          variant="secondaire"
          onPress={() => router.push({ pathname: '/programme/etape/[id]', params: { id: etape.id } })}
          disabled={enCours}
        />
        <Button label={t('objectifs.refuser')} variant="discret" onPress={onRefuser} disabled={enCours} />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s },
  boutons: { gap: spacing.s },
});

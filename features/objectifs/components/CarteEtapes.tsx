import { router } from 'expo-router';
import { Plus, Sparkles } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { colors, sizes, spacing } from '@/theme/tokens';

import { useObjectifs } from '../useObjectifs';
import { LigneEtape } from './LigneEtape';

/** Onglet Programme, sous l'objectif A : les prochaines étapes, les propositions du coach, l'accès à la frise. */
export function CarteEtapes() {
  const { t } = useTranslation();
  const o = useObjectifs();
  // Rien tant que la lecture n'a pas abouti : l'onglet a déjà ses propres états.
  if (!o.etapes.data) return null;
  const prochaines = o.frise.filter((e) => e.statut === 'actif').slice(0, 3);
  const ouvrir = () => router.push('/programme/objectifs');

  return (
    <Card>
      <AppText variant="surTitre">{t('objectifs.carteTitre')}</AppText>
      {o.proposees.length ? (
        <Button
          label={t('objectifs.propositions', { count: o.proposees.length })}
          icon={<Sparkles color={colors.surAccent} size={sizes.icone} />}
          onPress={ouvrir}
        />
      ) : null}
      {prochaines.length ? (
        <View>
          {prochaines.map((e) => (
            <LigneEtape key={e.id} etape={e} tests={o.tests} onPress={() => router.push({ pathname: '/programme/etape/[id]', params: { id: e.id } })} />
          ))}
        </View>
      ) : o.proposees.length ? null : (
        <AppText variant="secondaire">{t('objectifs.aucuneEtape')}</AppText>
      )}
      {prochaines.length ? (
        <Button label={t('objectifs.voirTout')} variant="secondaire" onPress={ouvrir} />
      ) : (
        <View style={styles.boutons}>
          <Button label={t('objectifs.construire')} variant="secondaire" icon={<Sparkles color={colors.texte} size={sizes.icone} />} onPress={o.construireAvecCoach} />
          <Button
            label={t('objectifs.ajouter')}
            variant="discret"
            icon={<Plus color={colors.accent} size={sizes.icone} />}
            onPress={() => router.push({ pathname: '/programme/etape/[id]', params: { id: 'nouvelle' } })}
          />
        </View>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  boutons: { gap: spacing.s },
});

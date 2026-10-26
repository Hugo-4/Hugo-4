import { router } from 'expo-router';
import { Flag, Plus, Sparkles, Trophy } from 'lucide-react-native';
import { RefreshControl, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { formatDateJour } from '@/features/progres/format';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { useObjectifs } from '../useObjectifs';
import { CarteProposition } from './CarteProposition';
import { LigneEtape } from './LigneEtape';

/** Mon objectif : l'objectif principal, les étapes proposées par le coach, puis la frise des étapes jusqu'au jour J. */
export function EcranObjectifs() {
  const { t } = useTranslation();
  const o = useObjectifs();
  const enCours = o.actions.changerStatut.isPending || o.actions.supprimer.isPending;

  return (
    <Screen>
      <EnTete titre={t('objectifs.titre')} />
      <EtatsEcran
        chargement={o.etapes.isPending}
        erreur={o.etapes.error}
        aDesDonnees={o.etapes.data !== undefined}
        onReessayer={o.etapes.refetch}
        squelette={
          <View style={styles.contenu}>
            {[0, 1, 2].map((i) => (
              <Skeleton key={i} hauteur={sizes.graphique / 2} arrondi={radius.carte} />
            ))}
          </View>
        }>
        <ScrollView
          contentContainerStyle={styles.contenu}
          refreshControl={
            <RefreshControl
              refreshing={o.etapes.isRefetching}
              onRefresh={() => {
                o.etapes.refetch();
              }}
              tintColor={colors.accent}
            />
          }>
          <Card>
            <View style={styles.ligne}>
              <Trophy color={colors.accent} size={sizes.icone} />
              <View style={styles.flex}>
                <AppText variant="surTitre">{t('objectifs.principal')}</AppText>
                <AppText variant="sousTitre">{o.objectif?.nom ?? t('objectifs.aucunPrincipal')}</AppText>
                {o.objectif ? <AppText variant="secondaire">{formatDateJour(o.objectif.date_evenement)}</AppText> : null}
              </View>
            </View>
            <Button label={t('objectifs.modifierPrincipal')} variant="discret" onPress={() => router.push('/compte/objectifs')} />
          </Card>
          {o.proposees.map((e) => (
            <CarteProposition key={e.id} etape={e} enCours={enCours} onAccepter={() => o.accepter(e.id)} onRefuser={() => o.refuser(e.id)} />
          ))}
          <Card>
            <AppText variant="surTitre">{t('objectifs.frise')}</AppText>
            {o.frise.length ? (
              o.frise.map((e) => (
                <View key={e.id} style={styles.etape}>
                  <View style={styles.trait} />
                  <View style={styles.flex}>
                    <LigneEtape etape={e} tests={o.tests} onPress={() => router.push({ pathname: '/programme/etape/[id]', params: { id: e.id } })} />
                  </View>
                </View>
              ))
            ) : (
              <AppText variant="secondaire">{t('objectifs.aucuneEtape')}</AppText>
            )}
            {o.objectif ? (
              <View style={styles.ligne} accessible>
                <Flag color={colors.texte2} size={sizes.icone} />
                <AppText variant="corpsGras" style={styles.flex}>
                  {t('objectifs.jourJ', { nom: o.objectif.nom, date: formatDateJour(o.objectif.date_evenement) })}
                </AppText>
              </View>
            ) : null}
          </Card>
          <Button label={t('objectifs.construire')} icon={<Sparkles color={colors.surAccent} size={sizes.icone} />} onPress={o.construireAvecCoach} />
          <Button
            label={t('objectifs.ajouter')}
            variant="secondaire"
            icon={<Plus color={colors.texte} size={sizes.icone} />}
            onPress={() => router.push({ pathname: '/programme/etape/[id]', params: { id: 'nouvelle' } })}
          />
        </ScrollView>
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  contenu: { padding: spacing.ecran, gap: spacing.entreCartes },
  ligne: { flexDirection: 'row', alignItems: 'center', gap: spacing.m },
  flex: { flex: 1 },
  etape: { flexDirection: 'row', gap: spacing.s },
  trait: { width: sizes.bordureForte, backgroundColor: colors.ligne, borderRadius: radius.rond },
});

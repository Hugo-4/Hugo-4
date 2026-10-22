import { router } from 'expo-router';
import { X } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { EchelleNote } from '@/features/checkin/components/EchelleNote';
import { SectionDouleurs } from '@/features/checkin/components/SectionDouleurs';
import { SectionPassager } from '@/features/checkin/components/SectionPassager';
import { SectionSeance } from '@/features/checkin/components/SectionSeance';
import { ECHELLES } from '@/features/checkin/constantes';
import { useCheckin } from '@/features/checkin/useCheckin';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { colors, sizes, spacing } from '@/theme/tokens';

/** Check-in du matin (feuille modale). */
export default function CheckinScreen() {
  const { t } = useTranslation();
  const c = useCheckin();

  return (
    <Screen>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.entete}>
          <AppText variant="titre" accessibilityRole="header" style={styles.flex}>
            {t('checkin.titre')}
          </AppText>
          <IconButton accessibilityLabel={t('commun.fermer')} onPress={() => router.back()}>
            <X color={colors.texte} size={sizes.icone} />
          </IconButton>
        </View>
        {c.pret ? (
          <ScrollView contentContainerStyle={styles.contenu}>
            {ECHELLES.map((echelle) => (
              <View key={echelle} style={styles.groupe}>
                <EchelleNote
                  echelle={echelle}
                  valeur={c.saisie.notes[echelle]}
                  onChange={(note) => c.modifier({ notes: { ...c.saisie.notes, [echelle]: note } })}
                />
                {echelle === 'energie' && c.energieBasse ? (
                  <SectionPassager
                    valeur={c.saisie.causePonctuelle}
                    onChange={(causePonctuelle) => c.modifier({ causePonctuelle })}
                  />
                ) : null}
              </View>
            ))}
            <SectionDouleurs
              consentementSante={c.consentementSante}
              douleurs={c.saisie.douleurs}
              onChange={(douleurs) => c.modifier({ douleurs })}
            />
            <SectionSeance
              dureeMin={c.saisie.dureeMin}
              lieuId={c.saisie.lieuId}
              lieux={c.lieux}
              onDuree={(dureeMin) => c.modifier({ dureeMin })}
              onLieu={(lieuId) => c.modifier({ lieuId })}
            />
          </ScrollView>
        ) : (
          <View style={styles.contenu}>
            <Skeleton hauteur={sizes.anneauForme * 2} />
          </View>
        )}
        <View style={styles.pied}>
          {c.enregistrement.isError ? <ErreurEnregistrement erreur={c.enregistrement.error} /> : null}
          <Button
            label={t('checkin.envoyer')}
            onPress={c.envoyer}
            disabled={!c.complet || c.enregistrement.isPending}
          />
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  entete: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: spacing.ecran, paddingTop: spacing.s },
  contenu: { padding: spacing.ecran, gap: spacing.xxl },
  groupe: { gap: spacing.l },
  pied: { padding: spacing.ecran, gap: spacing.s, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne },
});

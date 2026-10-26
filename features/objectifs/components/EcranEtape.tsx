import { router } from 'expo-router';
import { SearchX } from 'lucide-react-native';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { DateField } from '@/components/DateField';
import { EmptyState } from '@/components/EmptyState';
import { EnTete } from '@/components/EnTete';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { TextField } from '@/components/TextField';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { GroupePuces } from '@/features/programme/components/GroupePuces';
import { texteTest } from '@/features/questionnaire/textes';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, sizes, spacing } from '@/theme/tokens';

import { estDuree } from '../saisie';
import { TYPES_ETAPE } from '../types';
import { useFormulaireEtape } from '../useFormulaireEtape';

/** Étape vers l'objectif : titre, date, type, indicateur suivi (départ → cible), rythme par semaine, notes. */
export function EcranEtape({ id }: { id: string }) {
  const { t } = useTranslation();
  const enLigne = useEnLigne();
  const f = useFormulaireEtape(id);
  const { champs: c, erreurs } = f;
  const duree = estDuree(c?.indicateur ?? null);

  return (
    <Screen>
      <EnTete titre={t(f.nouvelle ? 'objectifs.nouvelle' : 'objectifs.etape')} />
      <EtatsEcran
        chargement={!c && !f.introuvable && !f.o.etapes.error}
        erreur={f.o.etapes.error}
        aDesDonnees={c !== null || f.introuvable}
        onReessayer={f.o.etapes.refetch}
        squelette={<View style={styles.contenu}>{[0, 1, 2].map((i) => <Skeleton key={i} hauteur={sizes.cibleTactile} />)}</View>}>
        {f.introuvable || !c ? (
          <View style={styles.contenu}>
            <EmptyState icon={<SearchX color={colors.discret} size={sizes.icone * 2} />} titre={t('objectifs.introuvable')} />
            <Button label={t('objectifs.retour')} variant="secondaire" onPress={() => router.back()} />
          </View>
        ) : (
          <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
              <TextField
                label={t('objectifs.champs.titre')}
                placeholder={t('objectifs.champs.titreExemple')}
                value={c.titre}
                onChangeText={(titre) => f.modifier({ titre })}
                maxLength={120}
                erreur={erreurs.titre ? t('objectifs.erreurs.titre') : undefined}
              />
              <DateField label={t('objectifs.champs.date')} valeur={c.date} onChange={(date) => f.modifier({ date })} erreur={erreurs.date ? t('objectifs.erreurs.date') : undefined} />
              <GroupePuces titre={t('objectifs.champs.type')}>
                {TYPES_ETAPE.map((type) => (
                  <Chip key={type} role="radio" label={t(`objectifs.types.${type}`)} selectionne={c.type === type} onPress={() => f.modifier({ type })} />
                ))}
              </GroupePuces>
              <GroupePuces titre={t('objectifs.champs.indicateur')}>
                <Chip role="radio" label={t('objectifs.sansIndicateur')} selectionne={c.indicateur === null} onPress={() => f.choisirIndicateur(null)} />
                {f.indicateurs.map((libelle) => (
                  <Chip key={libelle} role="radio" label={texteTest(t, libelle)} selectionne={c.indicateur === libelle} onPress={() => f.choisirIndicateur(libelle)} />
                ))}
              </GroupePuces>
              {c.indicateur ? (
                <View style={styles.ligne}>
                  <View style={styles.flex}>
                    <TextField
                      label={t(duree ? 'objectifs.champs.departDuree' : 'objectifs.champs.depart')}
                      value={c.depart}
                      onChangeText={(depart) => f.modifier({ depart })}
                      keyboardType={duree ? 'numbers-and-punctuation' : 'decimal-pad'}
                    />
                  </View>
                  <View style={styles.flex}>
                    <TextField
                      label={t(duree ? 'objectifs.champs.cibleDuree' : 'objectifs.champs.cible')}
                      value={c.cible}
                      onChangeText={(cible) => f.modifier({ cible })}
                      keyboardType={duree ? 'numbers-and-punctuation' : 'decimal-pad'}
                      erreur={erreurs.cible ? t('objectifs.erreurs.cible') : undefined}
                    />
                  </View>
                </View>
              ) : null}
              <TextField
                label={t('objectifs.champs.progression')}
                aide={t('objectifs.champs.progressionAide')}
                value={c.progression}
                onChangeText={(progression) => f.modifier({ progression })}
                keyboardType="numbers-and-punctuation"
                erreur={erreurs.progression ? t('objectifs.erreurs.progression') : undefined}
              />
              <TextField label={t('objectifs.champs.notes')} value={c.notes} onChangeText={(notes) => f.modifier({ notes })} multiline maxLength={500} />
              {enLigne ? null : <Bandeau texte={t('objectifs.horsLigne')} />}
              {f.erreurEnvoi ? <ErreurEnregistrement erreur={f.erreurEnvoi} /> : null}
              <Button label={t('objectifs.enregistrer')} onPress={f.enregistrer} disabled={f.enCours || !enLigne} />
              {f.etape && f.etape.statut === 'actif' ? (
                <Button label={t('objectifs.marquerAtteinte')} variant="secondaire" onPress={f.marquerAtteinte} disabled={f.enCours || !enLigne} />
              ) : null}
              {f.etape ? <Button label={t('objectifs.supprimer')} variant="danger" onPress={f.supprimer} disabled={f.enCours || !enLigne} /> : null}
            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.l },
  ligne: { flexDirection: 'row', gap: spacing.s },
});

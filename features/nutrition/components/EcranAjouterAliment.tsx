import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { EnTete } from '@/components/EnTete';
import { Screen } from '@/components/Screen';
import { TextField } from '@/components/TextField';
import { dateDuJour } from '@/features/checkin/dateDuJour';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { GroupePuces } from '@/features/programme/components/GroupePuces';
import { formatJourDate } from '@/lib/format';
import { useEnLigne } from '@/lib/useEnLigne';
import { spacing } from '@/theme/tokens';

import { MOMENTS_REPAS } from '../types';
import { useAjoutAliment } from '../useAjoutAliment';
import { ApercuNutriments } from './ApercuNutriments';
import { FormulaireLibre } from './FormulaireLibre';
import { ListeAliments } from './ListeAliments';

/** Noter un aliment : le chercher dans la base (ou le saisir à la main), la quantité en grammes, le moment. */
export function EcranAjouterAliment({ params }: { params: { date?: string; moment?: string } }) {
  const { t } = useTranslation();
  const enLigne = useEnLigne();
  const a = useAjoutAliment(params);
  const formulaire = a.aliment !== null || a.libre;

  return (
    <Screen>
      <EnTete titre={t('nutrition.ajout.titre')} sousTitre={a.date === dateDuJour() ? t('nutrition.aujourdhui') : formatJourDate(a.date)} />
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
          {!formulaire ? (
            <ListeAliments
              recherche={a.recherche}
              onRecherche={a.setRecherche}
              resultats={a.resultats}
              onChoisir={a.choisir}
              onSaisirALaMain={a.saisirALaMain}
            />
          ) : (
            <>
              <Card>
                <AppText variant="sousTitre">{a.aliment ? a.aliment.nom : t('nutrition.ajout.alimentLibre')}</AppText>
                <Button label={t('nutrition.ajout.changer')} variant="discret" onPress={a.changer} />
              </Card>
              {a.libre ? <FormulaireLibre champs={a.champs} onModifier={a.modifierChamps} erreurs={a.erreurs} /> : null}
              <TextField
                label={t('nutrition.ajout.quantite')}
                aide={a.aliment?.portion_standard_g ? t('nutrition.ajout.portion', { g: a.aliment.portion_standard_g }) : undefined}
                value={a.quantite}
                onChangeText={a.setQuantite}
                keyboardType="decimal-pad"
                erreur={a.erreurs.quantite ? t('nutrition.ajout.erreurQuantite') : undefined}
              />
              {a.apercu ? <ApercuNutriments nutriments={a.apercu} /> : null}
              <GroupePuces titre={t('nutrition.ajout.moment')}>
                {MOMENTS_REPAS.map((m) => (
                  <Chip key={m} role="radio" label={t(`nutrition.moments.${m}`)} selectionne={a.moment === m} onPress={() => a.setMoment(m)} />
                ))}
              </GroupePuces>
              {enLigne ? null : <Bandeau texte={t('nutrition.horsLigne')} />}
              {a.erreurEnvoi ? <ErreurEnregistrement erreur={a.erreurEnvoi} /> : null}
              <View style={styles.actions}>
                <Button label={t('nutrition.ajout.enregistrer')} onPress={a.enregistrer} disabled={a.enCours || !enLigne} />
              </View>
            </>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.l },
  actions: { gap: spacing.s },
});

import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { DateField } from '@/components/DateField';
import { Segmente } from '@/components/Segmente';
import { TextField } from '@/components/TextField';
import { useTexteErreur } from '@/lib/texteErreur';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, sizes, spacing } from '@/theme/tokens';

import { PRIORITES, TYPES_EVENEMENT } from '../constantes';
import type { SportOption } from '../saisieEvenement';
import type { Evenement } from '../types';
import { useFormulaireEvenement } from '../useFormulaireEvenement';
import { AvisHorsLigne } from './AvisHorsLigne';
import { ChampPrecision } from './ChampPrecision';
import { GroupePuces } from './GroupePuces';

type Props = { evenement: Evenement | null; evenements: Evenement[]; sports: SportOption[] };

/** Compétition : nom, date, sport, type, précision selon le sport, priorité A/B/C, lieu et notes facultatifs. */
export function FormulaireEvenement(props: Props) {
  const { t } = useTranslation();
  const texteErreur = useTexteErreur();
  const enLigne = useEnLigne();
  const f = useFormulaireEvenement(props);
  const { saisie, erreurs } = f;

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
        <TextField
          label={t('programme.evenement.nom')}
          value={saisie.nom}
          onChangeText={(nom) => f.modifier({ nom })}
          erreur={erreurs.nom ? t('programme.evenement.erreurs.nomVide') : undefined}
        />
        <DateField
          label={t('programme.evenement.date')}
          valeur={saisie.date}
          onChange={(date) => f.modifier({ date })}
          erreur={erreurs.date ? t(`programme.evenement.erreurs.${erreurs.date === 'datePassee' ? 'datePassee' : 'dateInvalide'}`) : undefined}
        />
        {f.sports.length ? (
          <GroupePuces titre={t('programme.evenement.sport')}>
            {f.sports.map((s) => (
              <Chip key={s.id} role="radio" label={s.nom} selectionne={saisie.sportId === s.id} onPress={() => f.changerSport(s)} />
            ))}
          </GroupePuces>
        ) : null}
        <GroupePuces titre={t('programme.evenement.type')}>
          {TYPES_EVENEMENT.map((type) => (
            <Chip
              key={type}
              role="radio"
              label={t(`programme.evenement.types.${type}`)}
              selectionne={saisie.type === type}
              onPress={() => f.modifier({ type })}
            />
          ))}
        </GroupePuces>
        <ChampPrecision
          precision={f.precision}
          valeur={saisie.precision}
          onChange={(precision) => f.modifier({ precision })}
          erreur={Boolean(erreurs.precision)}
        />
        <View style={styles.groupe}>
          <AppText variant="libelle" color={colors.texte2}>
            {t('programme.evenement.priorite')}
          </AppText>
          <Segmente
            options={PRIORITES.map((p) => ({ valeur: p, label: p }))}
            valeur={saisie.priorite}
            onChange={(priorite) => f.modifier({ priorite })}
            accessibilityLabel={t('programme.evenement.priorite')}
          />
          <AppText variant="libelle">{t(`programme.evenement.prioriteAide.${saisie.priorite}`)}</AppText>
        </View>
        <TextField label={t('programme.evenement.lieu')} value={saisie.lieu} onChangeText={(lieu) => f.modifier({ lieu })} />
        <TextField label={t('programme.evenement.notes')} value={saisie.notes} onChangeText={(notes) => f.modifier({ notes })} multiline />
        {!f.creation ? (
          <Button label={t('programme.evenement.supprimer')} variant="danger" onPress={f.supprimer} disabled={f.enCours || !enLigne} />
        ) : null}
      </ScrollView>
      <View style={styles.pied}>
        {f.erreurEnvoi ? (
          <AppText variant="secondaire" color={colors.alerte} accessibilityRole="alert">
            {texteErreur(f.erreurEnvoi) ?? t('programme.erreurEnregistrement')}
          </AppText>
        ) : null}
        {enLigne ? null : <AvisHorsLigne />}
        <Button
          label={t(f.creation ? 'programme.evenement.ajouter' : 'programme.evenement.enregistrer')}
          onPress={f.enregistrer}
          disabled={f.enCours || !enLigne}
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.xl },
  groupe: { gap: spacing.xs },
  pied: { padding: spacing.ecran, gap: spacing.s, borderTopWidth: sizes.bordure, borderTopColor: colors.ligne },
});

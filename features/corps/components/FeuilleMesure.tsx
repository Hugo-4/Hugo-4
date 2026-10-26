import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Feuille } from '@/components/Feuille';
import { TextField } from '@/components/TextField';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { lireNombre } from '@/features/questionnaire/saisie';
import { useEnLigne } from '@/lib/useEnLigne';
import { colors, spacing } from '@/theme/tokens';

import { MOMENTS_PESEE, type MomentPesee } from '../types';

type Props = {
  mesure: 'taille' | 'poids';
  visible: boolean;
  valeurActuelle: number | null;
  enCours: boolean;
  erreur: unknown;
  onFermer: () => void;
  onEnregistrer: (valeur: number, moment?: MomentPesee) => void;
};

const BORNES = { taille: { min: 100, max: 230 }, poids: { min: 25, max: 300 } } as const;

/** Saisie d'une taille ou d'une pesée (avec le moment de la pesée, facultatif). */
export function FeuilleMesure({ mesure, visible, valeurActuelle, enCours, erreur, onFermer, onEnregistrer }: Props) {
  const { t } = useTranslation();
  const enLigne = useEnLigne();
  const [texte, setTexte] = useState(valeurActuelle === null ? '' : String(valeurActuelle).replace('.', ','));
  const [moment, setMoment] = useState<MomentPesee | undefined>(undefined);
  const nombre = lireNombre(texte);
  const { min, max } = BORNES[mesure];
  const valide = nombre !== null && nombre >= min && nombre <= max;

  return (
    <Feuille visible={visible} titre={t(`corps.${mesure}.feuille`)} onFermer={onFermer}>
      <TextField
        label={t(`corps.${mesure}.champ`)}
        value={texte}
        onChangeText={setTexte}
        keyboardType={mesure === 'poids' ? 'decimal-pad' : 'number-pad'}
        erreur={nombre !== null && !valide ? t('corps.horsBornes', { min, max }) : undefined}
      />
      {mesure === 'poids' ? (
        <View style={styles.groupe}>
          <AppText variant="corpsGras" color={colors.texte2}>
            {t('corps.poids.moment')}
          </AppText>
          <View style={styles.puces} accessibilityRole="radiogroup">
            {MOMENTS_PESEE.map((m) => (
              <Chip key={m} role="radio" label={t(`corps.poids.moments.${m}`)} selectionne={moment === m} onPress={() => setMoment(moment === m ? undefined : m)} />
            ))}
          </View>
        </View>
      ) : null}
      {enLigne ? null : <Bandeau texte={t('corps.horsLigne')} />}
      {erreur ? <ErreurEnregistrement erreur={erreur} /> : null}
      <Button label={t('corps.enregistrer')} onPress={() => valide && nombre !== null && onEnregistrer(nombre, moment)} disabled={!valide || enCours || !enLigne} />
    </Feuille>
  );
}

const styles = StyleSheet.create({
  groupe: { gap: spacing.s },
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

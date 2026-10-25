import { useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { ChoixNote } from '@/components/ChoixNote';
import { PasAPas } from '@/components/PasAPas';
import { TextField } from '@/components/TextField';
import { useConsentementSante } from '@/features/checkin/useConsentementSante';
import { sizes, spacing } from '@/theme/tokens';

import { douleursPourServeur } from '../resume';
import { useSeance } from '../SeanceProvider';
import type { RetourSeance } from '../types';
import { RPE_PROPOSES } from './SaisieSerie';

const FATIGUES = Array.from({ length: 10 }, (_, i) => i + 1);

/** Fin de séance : RPE global, durée réelle (préremplie), fatigue, douleurs, commentaire. */
export function FormulaireFin({ dureeMin, onValider }: { dureeMin: number; onValider: (r: RetourSeance) => void }) {
  const { t } = useTranslation();
  const { etat } = useSeance();
  const consentement = useConsentementSante();
  const [rpe, setRpe] = useState<number | null>(null);
  const [duree, setDuree] = useState(dureeMin);
  const [fatigue, setFatigue] = useState<number | null>(null);
  const [commentaire, setCommentaire] = useState('');
  const douleurs = douleursPourServeur(etat);

  const valider = () => {
    if (rpe === null) return;
    onValider({
      rpe,
      duree_reelle_min: duree,
      ...(fatigue !== null ? { niveau_fatigue_apres: fatigue } : {}),
      // Données de santé : envoyées seulement avec le consentement.
      ...(consentement.data && douleurs.length ? { douleurs } : {}),
      ...(commentaire.trim() ? { commentaire: commentaire.trim() } : {}),
    });
  };

  return (
    <View style={styles.ecran}>
      <ScrollView contentContainerStyle={styles.contenu} keyboardShouldPersistTaps="handled">
        <AppText variant="titre" accessibilityRole="header">
          {t('enSeance.fin.titre')}
        </AppText>
        <ChoixNote
          libelle={t('enSeance.fin.rpe')}
          valeurs={RPE_PROPOSES}
          valeur={rpe}
          onChange={setRpe}
          a11yValeur={(v) => t('enSeance.a11yRpe', { rpe: v })}
        />
        <PasAPas libelle={t('enSeance.fin.duree')} unite={t('enSeance.uniteMin')} valeur={duree} pas={5} min={1} max={600} onChange={setDuree} />
        <ChoixNote
          libelle={t('enSeance.fin.fatigue')}
          valeurs={FATIGUES}
          valeur={fatigue}
          onChange={setFatigue}
          a11yValeur={(v) => t('enSeance.fin.a11yFatigue', { valeur: v })}
        />
        {douleurs.length ? (
          <AppText variant="secondaire">{t('enSeance.fin.douleurs', { liste: douleurs.join(', ') })}</AppText>
        ) : null}
        <TextField
          label={t('enSeance.fin.commentaire')}
          value={commentaire}
          onChangeText={setCommentaire}
          multiline
          maxLength={2000}
        />
      </ScrollView>
      <View style={styles.bas}>
        <Button label={t('enSeance.fin.valider')} disabled={rpe === null} onPress={valider} style={styles.bouton} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.xl },
  bas: { paddingHorizontal: spacing.ecran, paddingBottom: spacing.s },
  bouton: { minHeight: sizes.boutonSeance },
});

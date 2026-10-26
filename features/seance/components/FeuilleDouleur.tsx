import { router } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { BoutonsUrgence } from '@/components/BoutonsUrgence';
import { Button } from '@/components/Button';
import { ChoixNote } from '@/components/ChoixNote';
import { Chip } from '@/components/Chip';
import { Feuille } from '@/components/Feuille';
import { useConsentementSante } from '@/features/checkin/useConsentementSante';
import { ZONES, type Zone } from '@/features/inscription/constantes';
import { colors, spacing } from '@/theme/tokens';

/** Au-delà de ce seuil (sur 10), l'exercice est arrêté (FRONTEND.md §2.8). */
export const SEUIL_ARRET_DOULEUR = 3;
const INTENSITES = Array.from({ length: 11 }, (_, i) => i);

type Props = {
  visible: boolean;
  onFermer: () => void;
  onSignaler: (zone: Zone, intensite: number) => void;
  /** Sans consentement santé : on arrête l'exercice sans rien enregistrer de la douleur. */
  onArreterSansDetail: () => void;
};

export function FeuilleDouleur({ visible, onFermer, onSignaler, onArreterSansDetail }: Props) {
  const { t } = useTranslation();
  const consentement = useConsentementSante();
  const [zone, setZone] = useState<Zone | null>(null);
  const [intensite, setIntensite] = useState<number | null>(null);
  const fermer = () => {
    setZone(null);
    setIntensite(null);
    onFermer();
  };

  return (
    <Feuille visible={visible} titre={t('enSeance.douleur.titre')} onFermer={fermer}>
      <AppText variant="secondaire" color={colors.alerte}>
        {t('enSeance.douleur.urgence')}
      </AppText>
      <BoutonsUrgence />
      {consentement.data ? (
        <>
          <View style={styles.puces}>
            {ZONES.map((z) => (
              <Chip key={z} role="radio" label={t(`inscription.zones.${z}`)} selectionne={zone === z} onPress={() => setZone(z)} />
            ))}
          </View>
          <ChoixNote
            libelle={t('enSeance.douleur.intensite')}
            valeurs={INTENSITES}
            valeur={intensite}
            onChange={setIntensite}
            a11yValeur={(v) => t('enSeance.douleur.a11yIntensite', { valeur: v })}
          />
          {intensite !== null && intensite > SEUIL_ARRET_DOULEUR ? (
            <AppText variant="corpsGras" color={colors.alerte}>
              {t('enSeance.douleur.arret')}
            </AppText>
          ) : null}
          <Button
            label={t('enSeance.douleur.valider')}
            disabled={!zone || intensite === null}
            onPress={() => {
              if (zone && intensite !== null) onSignaler(zone, intensite);
              fermer();
            }}
          />
        </>
      ) : (
        <>
          <AppText variant="secondaire">{t('enSeance.douleur.sansConsentement')}</AppText>
          <Button
            label={t('enSeance.douleur.arreterExercice')}
            onPress={() => {
              onArreterSansDetail();
              fermer();
            }}
          />
          <Button
            label={t('enSeance.douleur.consentements')}
            variant="discret"
            onPress={() => {
              fermer();
              router.push('/compte/consentements');
            }}
          />
        </>
      )}
    </Feuille>
  );
}

const styles = StyleSheet.create({
  puces: { flexDirection: 'row', flexWrap: 'wrap', gap: spacing.s },
});

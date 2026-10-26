import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { GroupeChoix } from '@/features/inscription/components/GroupeChoix';
import { ZONES, type Zone } from '@/features/inscription/constantes';
import { spacing } from '@/theme/tokens';

import type { EtatConsentement } from '../useCheckin';

type Props = {
  etatConsentement: EtatConsentement;
  douleurs: Zone[];
  onChange: (douleurs: Zone[]) => void;
  onActiverConsentement: () => void;
};

/** Zones douloureuses ; sans consentement « données de santé » (ou s'il n'a pas pu être lu), la question n'est pas posée. */
export function SectionDouleurs({ etatConsentement, douleurs, onChange, onActiverConsentement }: Props) {
  const { t } = useTranslation();
  if (etatConsentement === 'inconnu') {
    return <AppText variant="libelle">{t('checkin.douleursConsentementInconnu')}</AppText>;
  }
  if (etatConsentement === 'non') {
    return (
      <View style={styles.sansConsentement}>
        <AppText variant="libelle">{t('checkin.douleursSansConsentement')}</AppText>
        <Button label={t('checkin.activerConsentement')} variant="discret" onPress={onActiverConsentement} />
      </View>
    );
  }
  return (
    <GroupeChoix titre={t('checkin.douleurs')} aide={t('checkin.douleursAide')}>
      <Chip label={t('checkin.aucuneDouleur')} selectionne={douleurs.length === 0} onPress={() => onChange([])} />
      {ZONES.map((zone) => (
        <Chip
          key={zone}
          label={t(`inscription.zones.${zone}`)}
          selectionne={douleurs.includes(zone)}
          onPress={() => onChange(douleurs.includes(zone) ? douleurs.filter((z) => z !== zone) : [...douleurs, zone])}
        />
      ))}
    </GroupeChoix>
  );
}

const styles = StyleSheet.create({
  sansConsentement: { gap: spacing.xs, alignItems: 'flex-start' },
});

import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Card } from '@/components/Card';
import { Chip } from '@/components/Chip';
import { spacing } from '@/theme/tokens';

import { COTES, type Cote, GRAVITES, type Gravite, NATURES_DOULEUR, type NatureDouleur, ZONES, type Zone } from '../constantes';
import type { Douleur } from '../types';
import { GroupeChoix } from './GroupeChoix';

type Props = {
  onAjouter: (douleur: Douleur) => void;
};

export function DouleurFormulaire({ onAjouter }: Props) {
  const { t } = useTranslation();
  const [nature, setNature] = useState<NatureDouleur>('douleur');
  const [zone, setZone] = useState<Zone | null>(null);
  const [cote, setCote] = useState<Cote | null>(null);
  const [gravite, setGravite] = useState<Gravite | null>(null);

  const ajouter = () => {
    if (!zone || !cote || !gravite) return;
    onAjouter({ nature, zone, cote, gravite });
    setZone(null);
    setCote(null);
    setGravite(null);
  };

  return (
    <Card>
      <GroupeChoix titre={t('inscription.douleurs.nature')} radio>
        {NATURES_DOULEUR.map((n) => (
          <Chip key={n} role="radio" label={t(`inscription.douleurs.natures.${n}`)} selectionne={nature === n} onPress={() => setNature(n)} />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.douleurs.zone')} radio>
        {ZONES.map((z) => (
          <Chip key={z} role="radio" label={t(`inscription.zones.${z}`)} selectionne={zone === z} onPress={() => setZone(z)} />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.douleurs.cote')} radio>
        {COTES.map((c) => (
          <Chip key={c} role="radio" label={t(`inscription.douleurs.cotes.${c}`)} selectionne={cote === c} onPress={() => setCote(c)} />
        ))}
      </GroupeChoix>
      <GroupeChoix titre={t('inscription.douleurs.gravite')} radio>
        {GRAVITES.map((g) => (
          <Chip key={g} role="radio" label={t(`inscription.douleurs.gravites.${g}`)} selectionne={gravite === g} onPress={() => setGravite(g)} />
        ))}
      </GroupeChoix>
      <View style={styles.action}>
        <Button
          label={t('inscription.douleurs.ajouter')}
          variant="secondaire"
          onPress={ajouter}
          disabled={!zone || !cote || !gravite}
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  action: { marginTop: spacing.xs },
});

import { Trophy } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { Segmente } from '@/components/Segmente';
import { colors, sizes } from '@/theme/tokens';

import { ouvertureOrigine, ouvrirVue } from '../navigation';
import { PROGRES_FICTIF } from '../source';
import { useRecords } from '../useDonneesProgres';
import { useTests } from '../useTests';
import { BadgeExemple } from './BadgeExemple';
import { CadreVue } from './CadreVue';
import { LigneRecord } from './LigneRecord';

type Filtre = 'tous' | 'record' | 'jalon';

/**
 * Records et jalons (niveau 2) : liste datée de faits réels, du plus récent au plus ancien.
 * Chaque carte ouvre son origine (test ou séance) quand elle est connue (niveau 3).
 */
export function VueRecords() {
  const { t } = useTranslation();
  const records = useRecords();
  const tests = useTests();
  const [filtre, setFiltre] = useState<Filtre>('tous');
  const liste = (records.data ?? []).filter((r) => filtre === 'tous' || r.nature === filtre);

  return (
    <CadreVue
      titre={t('progres.vues.records')}
      requete={records}
      vide={records.data?.length === 0}
      etatVide={{
        icon: <Trophy color={colors.discret} size={sizes.icone * 2} />,
        titre: t('progres.records.videTitre'),
        texte: t('progres.records.videTexte'),
        action: <Button label={t('progres.tests.ajouter')} variant="secondaire" onPress={() => ouvrirVue('tests', { ajouter: '1' })} />,
      }}>
      {PROGRES_FICTIF ? <BadgeExemple style={styles.exemple} /> : null}
      <Segmente
        options={[
          { valeur: 'tous', label: t('progres.records.tous') },
          { valeur: 'record', label: t('progres.records.records') },
          { valeur: 'jalon', label: t('progres.records.jalons') },
        ]}
        valeur={filtre}
        onChange={setFiltre}
        accessibilityLabel={t('progres.records.filtre')}
      />
      {liste.map((record) => (
        <LigneRecord key={record.id} record={record} onPress={ouvertureOrigine(record, tests.data)} />
      ))}
    </CadreVue>
  );
}

const styles = StyleSheet.create({
  exemple: { alignSelf: 'flex-start' },
});

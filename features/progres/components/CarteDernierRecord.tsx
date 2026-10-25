import { etatSection } from '../etats';
import { ouvrirVue } from '../navigation';
import { useRecords } from '../useDonneesProgres';
import { CarteRecord } from './CarteRecord';

/**
 * Carte autonome « Dernier record ou jalon », prête pour l'écran Aujourd'hui (docs/ECRANS.md §1, point 7) :
 * fait réel uniquement ; toucher la carte ouvre Progrès › Records et jalons.
 */
export function CarteDernierRecord() {
  const records = useRecords();
  return (
    <CarteRecord
      records={records.data}
      etat={etatSection(records)}
      onReessayer={() => records.refetch()}
      onPress={() => ouvrirVue('records')}
    />
  );
}

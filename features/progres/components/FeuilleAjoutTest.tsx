import { useTranslation } from 'react-i18next';

import { Feuille } from '@/components/Feuille';

import { FormulaireTest } from './FormulaireTest';

type Props = {
  visible: boolean;
  /** Test présélectionné (détail d'un test, test conseillé pour un niveau). */
  typeInitial?: string;
  onFermer: () => void;
  onEnregistre: () => void;
};

/** Feuille « Ajouter un résultat » : le formulaire repart de zéro à chaque ouverture. */
export function FeuilleAjoutTest({ visible, typeInitial, onFermer, onEnregistre }: Props) {
  const { t } = useTranslation();
  return (
    <Feuille visible={visible} titre={t('progres.ajout.titre')} onFermer={onFermer}>
      {visible ? <FormulaireTest typeInitial={typeInitial} onEnregistre={onEnregistre} /> : null}
    </Feuille>
  );
}

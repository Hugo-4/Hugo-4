import { useTranslation } from 'react-i18next';

import { Chip } from '@/components/Chip';

import { CADRES, type Cadre } from '../constantes';
import { GroupeChoix } from './GroupeChoix';

type Props = {
  titre: string;
  valeur: Cadre | undefined;
  onChange: (cadre: Cadre) => void;
};

/** Loisir / amateur / pro pour un sport. */
export function ChoixCadre({ titre, valeur, onChange }: Props) {
  const { t } = useTranslation();
  return (
    <GroupeChoix titre={titre} radio>
      {CADRES.map((cadre) => (
        <Chip
          key={cadre}
          role="radio"
          label={t(`inscription.cadre.${cadre}`)}
          accessibilityLabel={`${titre} : ${t(`inscription.cadre.${cadre}`)}`}
          selectionne={valeur === cadre}
          onPress={() => onChange(cadre)}
        />
      ))}
    </GroupeChoix>
  );
}

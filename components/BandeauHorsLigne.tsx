import { CloudOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { useEnLigne } from '@/lib/useEnLigne';
import { colors, sizes } from '@/theme/tokens';

import { Bandeau } from './Bandeau';

/** « Hors ligne · dernières données reçues » : discret, ne bloque jamais l'écran. */
export function BandeauHorsLigne({ texte }: { texte?: string }) {
  const { t } = useTranslation();
  const enLigne = useEnLigne();
  if (enLigne) return null;
  return (
    <Bandeau icon={<CloudOff color={colors.texte2} size={sizes.iconePetite} />} texte={texte ?? t('commun.horsLigne')} />
  );
}

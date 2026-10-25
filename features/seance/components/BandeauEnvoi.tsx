import { CloudOff } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Bandeau } from '@/components/Bandeau';
import { colors, sizes } from '@/theme/tokens';

import { useFileEnvoi } from '../useFileEnvoi';

/** « Hors ligne · 3 séries en attente d'envoi » : discret, ne bloque jamais la séance. */
export function BandeauEnvoi() {
  const { t } = useTranslation();
  const { enAttente, horsLigne } = useFileEnvoi();
  if (!horsLigne) return null;
  return (
    <Bandeau
      icon={<CloudOff color={colors.texte2} size={sizes.iconePetite} />}
      texte={t('enSeance.horsLigne', { count: enAttente })}
    />
  );
}

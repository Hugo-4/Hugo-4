import { LogOut } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { colors, sizes } from '@/theme/tokens';

import { useDeconnexion } from '../useAuthActions';

export function DeconnexionBouton() {
  const { t } = useTranslation();
  const deconnexion = useDeconnexion();
  return (
    <Button
      label={t('auth.deconnexion')}
      variant="secondaire"
      icon={<LogOut color={colors.texte} size={sizes.icone} />}
      disabled={deconnexion.isPending}
      onPress={() => deconnexion.mutate()}
    />
  );
}

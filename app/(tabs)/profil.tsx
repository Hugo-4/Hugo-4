import { User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { colors, sizes } from '@/theme/tokens';

export default function ProfilScreen() {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      titre={t('onglets.profil')}
      icon={<User color={colors.discret} size={sizes.icone * 2} />}
    />
  );
}

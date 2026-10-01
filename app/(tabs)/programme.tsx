import { CalendarDays } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { colors, sizes } from '@/theme/tokens';

export default function ProgrammeScreen() {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      titre={t('onglets.programme')}
      icon={<CalendarDays color={colors.discret} size={sizes.icone * 2} />}
    />
  );
}

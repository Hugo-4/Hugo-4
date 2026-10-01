import { ClipboardList } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { PlaceholderScreen } from '@/components/PlaceholderScreen';
import { DeconnexionBouton } from '@/features/auth/components/DeconnexionBouton';
import { colors, sizes } from '@/theme/tokens';

/** Questionnaire d'inscription : construit à l'étape 3. Affiché aux comptes connectés sans profil terminé. */
export default function InscriptionScreen() {
  const { t } = useTranslation();
  return (
    <PlaceholderScreen
      titre={t('inscription.titre')}
      icon={<ClipboardList color={colors.discret} size={sizes.icone * 2} />}>
      <DeconnexionBouton />
    </PlaceholderScreen>
  );
}

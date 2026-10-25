import { useTranslation } from 'react-i18next';

import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { ChoixLangue } from '@/features/parametres/components/ChoixLangue';
import { SectionEntrainement } from '@/features/parametres/components/SectionEntrainement';
import { SectionNotifications } from '@/features/parametres/components/SectionNotifications';
import { SectionNutrition } from '@/features/parametres/components/SectionNutrition';
import { SectionStyle } from '@/features/parametres/components/SectionStyle';
import { useModifierPreferences, usePreferences } from '@/features/parametres/usePreferences';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { radius, sizes } from '@/theme/tokens';

/**
 * Profil : préférences d'entraînement, de nutrition, de style de coaching, de notifications et langue.
 * Chaque réglage est enregistré dès qu'il change (PATCH /preferences).
 */
export default function PreferencesScreen() {
  const { t } = useTranslation();
  const preferences = usePreferences();
  const modification = useModifierPreferences();
  const p = preferences.data;

  return (
    <EcranEdition
      titre={t('parametres.preferences.titre')}
      rafraichir={{ actif: preferences.isRefetching, onRafraichir: preferences.refetch }}
      bandeau={modification.isError ? <ErreurEnregistrement erreur={modification.error} /> : null}>
      <EtatsEcran
        chargement={preferences.isPending}
        erreur={preferences.error}
        aDesDonnees={p !== undefined}
        onReessayer={preferences.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme * 2} arrondi={radius.carte} />}>
        {p ? (
          <>
            <SectionEntrainement preferences={p} onModifier={modification.mutate} />
            <SectionNutrition />
            <SectionStyle preferences={p} onModifier={modification.mutate} />
            <SectionNotifications preferences={p} onModifier={modification.mutate} />
          </>
        ) : null}
      </EtatsEcran>
      <ChoixLangue />
    </EcranEdition>
  );
}

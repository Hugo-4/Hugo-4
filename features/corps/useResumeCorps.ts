import { useTranslation } from 'react-i18next';

import { formatNombre } from '@/lib/format';
import { useQuestionnaire } from '@/features/questionnaire/useQuestionnaire';

/** « 178 cm · 70 kg » pour la ligne Mon corps du Profil (ce qui est connu seulement), sinon `null`. */
export function useResumeCorps(): string | null {
  const { t } = useTranslation();
  const q = useQuestionnaire();
  if (!q.pret) return null;
  const { TC09: taille, TC10: poids } = q.contexte.valeurs;
  const parties = [
    typeof taille === 'number' ? t('corps.cm', { valeur: formatNombre(taille) }) : null,
    typeof poids === 'number' ? t('corps.kg', { valeur: formatNombre(poids, 1) }) : null,
  ].filter(Boolean);
  return parties.length ? parties.join(' · ') : null;
}

import { useTranslation } from 'react-i18next';

import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { QuestionLayout } from '@/features/inscription/components/QuestionLayout';
import { EtapeCourante } from '@/features/inscription/etapes/EtapeCourante';
import { useQuestionnaire } from '@/features/inscription/useQuestionnaire';

/** Une question par écran ; la dernière enregistre tout puis lance la génération. */
export default function QuestionsScreen() {
  const { t } = useTranslation();
  const q = useQuestionnaire();

  return (
    <QuestionLayout
      titre={t(`inscription.etapes.${q.etape}.titre`)}
      sousTitre={t(`inscription.etapes.${q.etape}.sousTitre`)}
      numero={q.numero}
      total={q.total}
      onRetour={q.retour}
      onSuivant={q.suivant}
      suivantActif={q.valide}
      enCours={q.enregistrement.isPending}
      libelleSuivant={q.derniere ? t('inscription.terminer') : undefined}
      bandeau={q.enregistrement.isError ? <ErreurEnregistrement erreur={q.enregistrement.error} /> : null}>
      <EtapeCourante etape={q.etape} />
    </QuestionLayout>
  );
}

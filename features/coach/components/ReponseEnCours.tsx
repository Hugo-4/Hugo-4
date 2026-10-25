import { BulleMessage } from './BulleMessage';
import { IndicateurReflexion } from './IndicateurReflexion';

/** Réponse du coach en préparation : le texte au fil de l'eau si la source le permet, sinon l'indicateur. */
export function ReponseEnCours({ fragment }: { fragment: string | null }) {
  return fragment ? <BulleMessage role="coach" texte={fragment} /> : <IndicateurReflexion />;
}

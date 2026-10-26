import { EcranCoach } from '@/features/coach/components/EcranCoach';

/**
 * Le Coach ouvert depuis une séance en cours (« Remplacer avec le coach ») : en modale au-dessus de la séance,
 * pour que le retour ramène à la séance au lieu d'empiler un second jeu d'onglets.
 */
export default function CoachSeanceScreen() {
  return <EcranCoach />;
}

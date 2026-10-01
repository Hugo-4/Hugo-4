import { ListeReferentiel } from '../components/ListeReferentiel';
import { useInscription } from '../InscriptionProvider';
import { libelleReferentiel } from '../libelles';
import { useSports } from '../useReferentiels';

export function EtapeSport() {
  const { reponses, modifier } = useInscription();
  const requete = useSports();
  return (
    <ListeReferentiel
      requete={requete}
      libelle={(sport) => libelleReferentiel('sports', sport)}
      estSelectionne={(id) => reponses.sportId === id}
      onChoisir={(sportId) =>
        modifier({ sportId, sportsSecondaires: reponses.sportsSecondaires.filter((id) => id !== sportId) })
      }
    />
  );
}

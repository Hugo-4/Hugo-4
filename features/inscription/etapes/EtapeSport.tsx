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
        sportId !== reponses.sportId &&
        modifier({
          sportId,
          ambition: null,
          objectifSport: null,
          sportsSecondaires: reponses.sportsSecondaires.filter((id) => id !== sportId),
        })
      }
    />
  );
}

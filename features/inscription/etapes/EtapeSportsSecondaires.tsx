import { ListeReferentiel } from '../components/ListeReferentiel';
import { useInscription } from '../InscriptionProvider';
import { libelleReferentiel } from '../libelles';
import { useSports } from '../useReferentiels';

/** Sports complémentaires (facultatif) : enregistrés avec le rôle « complementaire ». */
export function EtapeSportsSecondaires() {
  const { reponses, modifier } = useInscription();
  const requete = useSports();
  const { sportsSecondaires } = reponses;
  return (
    <ListeReferentiel
      multiple
      requete={requete}
      exclus={reponses.sportId ? [reponses.sportId] : []}
      libelle={(sport) => libelleReferentiel('sports', sport)}
      estSelectionne={(id) => sportsSecondaires.includes(id)}
      onChoisir={(id) =>
        modifier({
          sportsSecondaires: sportsSecondaires.includes(id)
            ? sportsSecondaires.filter((autre) => autre !== id)
            : [...sportsSecondaires, id],
        })
      }
    />
  );
}

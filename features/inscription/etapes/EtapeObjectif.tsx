import { ListeReferentiel } from '../components/ListeReferentiel';
import { useInscription } from '../InscriptionProvider';
import { descriptionObjectif, libelleReferentiel } from '../libelles';
import { useObjectifs } from '../useReferentiels';

export function EtapeObjectif() {
  const { reponses, modifier } = useInscription();
  const requete = useObjectifs();
  return (
    <ListeReferentiel
      requete={requete}
      libelle={(objectif) => libelleReferentiel('objectifs', objectif)}
      description={descriptionObjectif}
      estSelectionne={(id) => reponses.objectifId === id}
      onChoisir={(objectifId) => modifier({ objectifId })}
    />
  );
}

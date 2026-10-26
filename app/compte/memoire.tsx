import { useLocalSearchParams } from 'expo-router';

import { EditionSouvenir } from '@/features/parametres/components/EditionSouvenir';
import { ListeMemoire } from '@/features/parametres/components/ListeMemoire';

/** Profil : ce que le coach a retenu. Sans paramètre : la liste ; `?id=<uuid>` : un élément (modifier, effacer). */
export default function MemoireScreen() {
  const { id } = useLocalSearchParams<{ id?: string }>();
  return id ? <EditionSouvenir id={id} /> : <ListeMemoire />;
}

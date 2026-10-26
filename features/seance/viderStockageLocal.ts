import AsyncStorage from '@react-native-async-storage/async-storage';

import { lister, retirer } from './fileEnvoi';
import { annulerFinRepos } from './notificationRepos';

/** Clés fixes écrites sur le téléphone (fileEnvoi.ts, stockageSeance.ts, checkin/brouillonCheckin.ts). */
const CLES_FIXES = ['athlenis.fileEnvoi.v1', 'athlenis.seanceEnCours.v1', 'athlenis.seanceVue.v1', 'athlenis.brouillonCheckin.v1'];
/** Une clé par compte (features/langue/useLangueProfil.ts). */
const PREFIXE_LANGUE = 'athlenis.langueInitialisee.';

/**
 * Efface tout ce qu'Athlenis a gardé sur le téléphone (suppression du compte, RGPD) : file d'envoi des
 * séries, séance en cours, vue préférée, marqueurs de langue, et la notification de fin de repos programmée.
 * Chaque étape est tentée même si une autre échoue ; la première erreur est renvoyée à la fin.
 */
export async function viderStockageLocal(): Promise<void> {
  const erreurs: unknown[] = [];
  const tenter = async (etape: () => Promise<unknown>) => {
    try {
      await etape();
    } catch (erreur) {
      erreurs.push(erreur);
    }
  };

  // D'abord par la file elle-même : un envoi en cours ne peut pas réécrire les séries juste après,
  // et le bandeau « séries en attente » est prévenu.
  await tenter(async () => retirer((await lister()).map((entree) => entree.id)));
  await tenter(async () => {
    const toutes = await AsyncStorage.getAllKeys();
    const aRetirer = new Set(CLES_FIXES);
    toutes.filter((cle) => cle.startsWith(PREFIXE_LANGUE)).forEach((cle) => aRetirer.add(cle));
    await AsyncStorage.multiRemove([...aRetirer]);
  });
  await tenter(annulerFinRepos);

  if (erreurs.length) throw erreurs[0];
}

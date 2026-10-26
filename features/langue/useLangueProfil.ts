import AsyncStorage from '@react-native-async-storage/async-storage';
import { useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { useSession } from '@/features/auth/AuthProvider';
import type { StatutCompte } from '@/features/auth/useStatutCompte';
import i18n, { estLangue, langueDuTelephone } from '@/lib/i18n';
import { supabase } from '@/lib/supabase';

/** Valeur par défaut de la colonne `users.langue` (NOT NULL, défaut « fr »). */
const LANGUE_PAR_DEFAUT = 'fr';
/** Un compte créé il y a moins de 10 minutes : vrai premier lancement après l'inscription. */
const DELAI_PREMIER_LANCEMENT_MS = 10 * 60_000;
/** Écriture initiale déjà tentée pendant cette ouverture de l'app : jamais de nouvel essai en boucle. */
const tentees = new Set<string>();

const cleInitialisee = (userId: string) => `athlenis.langueInitialisee.${userId}`;

/** Marque la langue comme réglée sur ce téléphone (aussi appelé quand l'athlète choisit dans Préférences). */
export async function marquerLangueReglee(userId: string): Promise<void> {
  await AsyncStorage.setItem(cleInitialisee(userId), '1').catch(() => undefined);
}

function vraiPremierLancement(statut: StatutCompte, telephone: string, creeLe: string | undefined): boolean {
  if (statut.langue === telephone || statut.langue !== LANGUE_PAR_DEFAUT) return false;
  // Inscription pas encore terminée (ex. email confirmé longtemps après la création) : c'est encore le premier lancement.
  if (!statut.onboardingComplete) return true;
  if (!creeLe) return false;
  // Valeur absolue : une horloge du téléphone un peu en retard ne doit pas tout fausser.
  return Math.abs(Date.now() - new Date(creeLe).getTime()) < DELAI_PREMIER_LANCEMENT_MS;
}

/**
 * La langue de l'app est un réglage du profil (`users.langue`, FRONTEND.md §1) ; `lib/api.ts` envoie
 * `Accept-Language`. Règle (la base ne dit pas si l'athlète a déjà choisi : colonne NOT NULL, défaut « fr ») :
 * - marqueur local présent (`athlenis.langueInitialisee.<id>`) : la valeur du profil fait foi, on l'applique ;
 * - marqueur absent et vrai premier lancement (profil à « fr » par défaut, téléphone dans une autre langue, et
 *   inscription pas encore terminée ou compte créé il y a moins de 10 minutes) : on écrit la langue du téléphone, une seule tentative par
 *   ouverture de l'app, et seulement si la base vaut encore « fr » ; si l'écriture échoue, on n'insiste pas ;
 * - marqueur absent sinon (réinstallation, nouvel appareil, compte ancien) : on n'écrase RIEN, on applique
 *   la valeur du profil et on pose le marqueur.
 * Un choix fait dans Préférences pose aussi le marqueur (`marquerLangueReglee`) : il n'est jamais réécrasé.
 */
export function useLangueProfil(userId: string | undefined, statut: StatutCompte | undefined) {
  const queryClient = useQueryClient();
  const { session } = useSession();
  const creeLe = session?.user.created_at;

  useEffect(() => {
    if (!userId || !statut) return;
    let actif = true;
    const appliquerProfil = async () => {
      if (!actif || !estLangue(statut.langue) || i18n.language === statut.langue) return;
      await i18n.changeLanguage(statut.langue);
      // Les textes du serveur suivent la langue : on recharge ce qui vient de lui.
      queryClient.invalidateQueries({ predicate: (q) => q.queryKey[0] !== 'statutCompte' });
    };
    (async () => {
      const dejaFait = await AsyncStorage.getItem(cleInitialisee(userId)).catch(() => null);
      if (dejaFait) return appliquerProfil();
      const telephone = langueDuTelephone();
      if (!vraiPremierLancement(statut, telephone, creeLe)) {
        await marquerLangueReglee(userId);
        return appliquerProfil();
      }
      // Premier lancement : l'app est déjà dans la langue du téléphone, on la recopie dans le profil.
      if (tentees.has(userId)) return;
      tentees.add(userId);
      const { error } = await supabase
        .from('users')
        .update({ langue: telephone })
        .eq('id', userId)
        .eq('langue', LANGUE_PAR_DEFAUT);
      if (error) return;
      await marquerLangueReglee(userId);
      if (actif) queryClient.invalidateQueries({ queryKey: ['statutCompte', userId] });
    })();
    return () => {
      actif = false;
    };
  }, [userId, statut, creeLe, queryClient]);
}

import { api } from '@/lib/api';
import { supabase } from '@/lib/supabase';

import type { Question, ReponseTest, ValeurReponse } from './types';

type Ligne = Record<string, unknown>;

/** Date du test d'après l'ancienneté déclarée (milieu de la période). */
const JOURS_ANCIENNETE: Record<ReponseTest['anciennete'], number> = { moins_3_mois: 30, '3_12_mois': 180, plus: 540 };

function dateIlYA(jours: number): string {
  const d = new Date();
  d.setDate(d.getDate() - jours);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function verifier(reponse: { error: unknown }) {
  if (reponse.error) throw reponse.error;
}

/**
 * Charge × répétitions → 1RM estimé (formule d'Epley, arrondi à 0,5 kg), envoyé comme valeur « déclarée ».
 * Le texte d'origine part dans `notes` : le serveur peut refaire son propre calcul (docs/MANQUES-SERVEUR.md §7).
 */
function unRmEstime(charge: number, repetitions: number): number {
  return repetitions <= 1 ? charge : Math.round(charge * (1 + repetitions / 30) * 2) / 2;
}

async function envoyerTest(type: string, exercice: string | undefined, r: ReponseTest) {
  const repetitions = r.repetitions ?? 1;
  await api.post('/tests', {
    type,
    valeur: unRmEstime(r.valeur, repetitions),
    ...(exercice ? { exercice } : {}),
    date_test: dateIlYA(JOURS_ANCIENNETE[r.anciennete]),
    methode: r.methode === 'test' ? 'teste' : 'declare',
    notes: [repetitions > 1 ? `${r.valeur} kg × ${repetitions}` : null, `questionnaire : ${r.methode}`].filter(Boolean).join(' · '),
  });
}

/** Lit un champ JSON de l'athlète puis le réécrit fusionné (aucune autre clé n'est perdue). */
async function fusionnerJson(tableNom: string, filtre: [string, string], colonne: string, cle: string, valeur: unknown, upsert = false) {
  const lu = await supabase.from(tableNom).select(colonne).eq(filtre[0], filtre[1]).maybeSingle();
  verifier(lu);
  const actuel = ((lu.data as Ligne | null)?.[colonne] as Ligne | null) ?? {};
  const fusion = { ...actuel, [cle]: valeur };
  verifier(
    upsert
      ? await supabase.from(tableNom).upsert({ [filtre[0]]: filtre[1], [colonne]: fusion }, { onConflict: filtre[0] })
      : await supabase.from(tableNom).update({ [colonne]: fusion }).eq(filtre[0], filtre[1]),
  );
}

/** Enregistre une réponse là où elle doit aller (RLS : uniquement les lignes de l'athlète). */
export async function ecrireReponse(q: Question, valeur: ValeurReponse, userId: string, sportProfilId: string | null) {
  const d = q.destination;
  switch (d.kind) {
    case 'test':
      return envoyerTest(d.type, d.exercice, valeur as ReponseTest);
    case 'poids':
      // Comme une pesée : l'historique et la tendance restent justes (plan nutrition du jour).
      await api.post('/poids', { poids_kg: valeur });
      return;
    case 'profil':
      return verifier(await supabase.from('user_profiles').update({ [d.colonne]: d.versBase ? d.versBase(valeur) : valeur }).eq('user_id', userId));
    case 'profilJson':
      return fusionnerJson('user_profiles', ['user_id', userId], d.colonne, d.cle, valeur);
    case 'table':
      return verifier(
        await supabase.from(d.table).upsert({ user_id: userId, [d.colonne]: d.versBase ? d.versBase(valeur) : valeur }, { onConflict: 'user_id' }),
      );
    case 'tableJson':
      return fusionnerJson(d.table, ['user_id', userId], d.colonne, d.cle, { reponse: valeur === 'oui', le: dateIlYA(0) }, true);
    case 'sport':
      if (!sportProfilId) throw new Error('sport principal inconnu');
      return fusionnerJson('user_sport_profiles', ['id', sportProfilId], 'profil_specifique', d.cle, valeur);
  }
}

/** Trace la question comme répondue ou passée : reprise du questionnaire et pourcentage rempli. */
export async function marquerQuestion(userId: string, questionId: string, statut: 'repondue' | 'passee') {
  verifier(
    await supabase.from('questions_posees').upsert(
      {
        user_id: userId,
        question_id: questionId,
        statut,
        moment: 'questionnaire',
        presentee_le: new Date().toISOString(),
        repondue_le: statut === 'repondue' ? new Date().toISOString() : null,
      },
      { onConflict: 'user_id,question_id' },
    ),
  );
}

import { formatNombre } from '@/lib/format';
import i18n from '@/lib/i18n';

import { ZONE_OPTIMALE } from './constantes';
import type { GroupeTest } from './regroupement';
import type { GroupeComparaison, MethodeTest, QualiteNiveau, TypeTest } from './types';

/** Libellés d'interface pour les codes renvoyés par le serveur (jamais de texte de coaching). */

/** Nom complet d'un test : « 1RM · Squat barre · gauche ». */
export function libelleTest(groupe: Pick<GroupeTest, 'type' | 'exercice' | 'cote'>): string {
  const cote = groupe.cote === 'gauche' ? i18n.t('progres.tests.cote.gauche') : groupe.cote === 'droite' ? i18n.t('progres.tests.cote.droite') : null;
  return [groupe.type.nom, groupe.exercice?.nom, cote].filter(Boolean).join(' · ');
}

/** Méthodes qui ne sont pas un test passé ou une valeur déclarée (valeurs de `tests_athlete.methode`). */
const ESTIMATIONS = ['estime_seance', 'estime_montre', 'formule'];

export function libelleMethode(methode: MethodeTest | string | null): string | null {
  if (methode === 'teste') return i18n.t('progres.tests.methode.teste');
  if (methode === 'declare') return i18n.t('progres.tests.methode.declare');
  if (methode && ESTIMATIONS.includes(methode)) return i18n.t('progres.tests.methode.estime');
  return null;
}

/**
 * Le niveau renvoie-t-il vers une vraie courbe de test (`/progres/tests?type=…`) ? Non pour une estimation (1RM
 * estimé en séance…), ni pour un test par exercice (1RM) : le niveau ne dit pas l'exercice, la courbe serait vide.
 */
export function courbeDisponible(test: QualiteNiveau['test'], types: TypeTest[] | undefined): boolean {
  if (test.methode && ESTIMATIONS.includes(test.methode)) return false;
  const parExercice = types?.find((type) => type.slug === test.slug)?.par_exercice ?? test.slug === '1rm';
  return !parExercice;
}

export type ZoneCharge = 'sous_charge' | 'optimale' | 'vigilance' | 'danger';

const ZONES_CONNUES = new Map<string, ZoneCharge>([
  ['sous_charge', 'sous_charge'],
  [ZONE_OPTIMALE, 'optimale'],
  ['vigilance', 'vigilance'],
  ['danger', 'danger'],
]);

/**
 * Zone de charge décidée par le serveur (`GET /profil` → `charge.zone`, fonction SQL profil_avance). Seuls les
 * codes exacts sont affichés (`sous_charge`, `vigilance`, `danger` lus par tools/profilAthlete.js, et
 * `ZONE_OPTIMALE`) : un code inconnu n'affiche rien plutôt qu'une zone inventée.
 */
export function zoneCharge(zone: string | null): ZoneCharge | null {
  return (zone && ZONES_CONNUES.get(zone)) || null;
}

const TENDANCES = ['debut', 'progression_rapide', 'progression_stable', 'stagnation', 'regression'] as const;

/** Tendance d'un exercice calculée par le serveur (`GET /progressions`) ; `null` si le code est inconnu. */
export function libelleProgression(tendance: string | null): string | null {
  const code = TENDANCES.find((t) => t === tendance);
  return code ? i18n.t(`progres.tests.progression.${code}`) : null;
}

const NIVEAUX = ['debutant', 'amateur', 'confirme', 'pro', 'elite'] as const;

/** Groupe de comparaison lisible : « amateurs · 25-34 ans · hommes · Boxe anglaise ». */
export function libelleGroupe(groupe: GroupeComparaison): string {
  const niveau = NIVEAUX.find((n) => n === groupe.niveau);
  return [
    niveau ? i18n.t(`progres.niveaux.niveau.${niveau}`) : null,
    groupe.tranche_age ? i18n.t('progres.niveaux.trancheAge', { tranche: groupe.tranche_age }) : null,
    groupe.sexe ? i18n.t(`progres.niveaux.sexe.${groupe.sexe}`) : null,
    groupe.sport?.nom ?? null,
  ]
    .filter(Boolean)
    .join(' · ');
}

/** « Comparé à : amateurs · 25-34 ans · Boxe anglaise (1 240 athlètes) ». */
export function libelleComparaison(groupe: GroupeComparaison): string {
  return i18n.t('progres.niveaux.groupe', {
    groupe: libelleGroupe(groupe),
    effectif: i18n.t('progres.niveaux.effectif', { count: groupe.effectif, nombre: formatNombre(groupe.effectif) }),
  });
}

/** Deux groupes identiques (même niveau, âge, sexe, sport, effectif) : affichés une seule fois. */
export function memeGroupe(a: GroupeComparaison, b: GroupeComparaison): boolean {
  return libelleComparaison(a) === libelleComparaison(b);
}

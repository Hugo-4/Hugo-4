import { formatNombre } from '@/lib/format';
import i18n from '@/lib/i18n';

import type { GroupeTest } from './regroupement';
import type { GroupeComparaison, MethodeTest } from './types';

/** Libellés d'interface pour les codes renvoyés par le serveur (jamais de texte de coaching). */

/** Nom complet d'un test : « 1RM · Squat barre · gauche ». */
export function libelleTest(groupe: Pick<GroupeTest, 'type' | 'exercice' | 'cote'>): string {
  const cote = groupe.cote === 'gauche' ? i18n.t('progres.tests.cote.gauche') : groupe.cote === 'droite' ? i18n.t('progres.tests.cote.droite') : null;
  return [groupe.type.nom, groupe.exercice?.nom, cote].filter(Boolean).join(' · ');
}

export function libelleMethode(methode: MethodeTest | string | null): string | null {
  if (methode === 'teste') return i18n.t('progres.tests.methode.teste');
  if (methode === 'declare') return i18n.t('progres.tests.methode.declare');
  if (methode === 'estime_seance' || methode === 'estime_montre' || methode === 'formule') return i18n.t('progres.tests.methode.estime');
  return null;
}

export type ZoneCharge = 'sous_charge' | 'optimale' | 'vigilance' | 'danger';

/**
 * Zone de charge décidée par le serveur (`GET /profil` → `charge.zone`). Hors des trois zones à risque connues,
 * le serveur n'ajuste rien (tools/profilAthlete.js) : c'est la zone optimale.
 */
export function zoneCharge(zone: string | null): ZoneCharge | null {
  if (!zone) return null;
  return zone === 'sous_charge' || zone === 'vigilance' || zone === 'danger' ? zone : 'optimale';
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

import type { Credits, ExportDonnees, Offre, PreferencesNutrition } from './types';

/**
 * Données fictives au format des routes manquantes du Profil (docs/MANQUES-SERVEUR.md §6).
 * Les identifiants commencent par « fictif- ». L'état vit en mémoire le temps de la session.
 */
const PREFIXE = 'fictif-';

const iso = (date: Date) =>
  `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

const CREDITS_INCLUS: Record<Offre, number> = { free: 30, premium: 300, pro: 1000, coach: 3000 };

/** GET /credits : mois en cours, du 1er au dernier jour. */
export function creditsFictifs(offre: Offre): Credits {
  const maintenant = new Date();
  const debut = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1);
  const fin = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0);
  const renouvellement = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 1);
  const inclus = CREDITS_INCLUS[offre];
  const detail = [
    { type: 'chat', credits: Math.round(inclus * 0.3) },
    { type: 'adaptation', credits: Math.round(inclus * 0.06) },
    { type: 'generation', credits: Math.round(inclus * 0.1) },
  ];
  const utilises = detail.reduce((total, d) => total + d.credits, 0);
  return {
    offre,
    periode: { debut: iso(debut), fin: iso(fin) },
    inclus,
    utilises,
    restants: inclus - utilises,
    renouvellement_le: iso(renouvellement),
    detail,
  };
}

let exportFictif: ExportDonnees | null = null;

/** GET /compte/export : dernière demande d'export (aucune au départ). */
export function lireExportFictif(): ExportDonnees | null {
  return exportFictif;
}

/** POST /compte/export : la demande reste « en préparation » (aucun fichier n'est produit en fictif). */
export function demanderExportFictif(): ExportDonnees {
  if (exportFictif?.statut === 'en_preparation') return exportFictif;
  exportFictif = {
    id: `${PREFIXE}export-${Date.now()}`,
    statut: 'en_preparation',
    demande_le: new Date().toISOString(),
    pret_le: null,
    url: null,
    expire_le: null,
  };
  return exportFictif;
}

let nutritionFictive: PreferencesNutrition = { regime: 'omnivore', repas_par_jour: 4, allergies: [] };

/** GET /preferences/nutrition. Sans consentement santé, le serveur ne renvoie pas les allergies. */
export function lireNutritionFictive(avecSante: boolean): PreferencesNutrition {
  return avecSante ? nutritionFictive : { ...nutritionFictive, allergies: [] };
}

/** PATCH /preferences/nutrition : fusion des champs envoyés. */
export function modifierNutritionFictive(modification: Partial<PreferencesNutrition>): PreferencesNutrition {
  nutritionFictive = { ...nutritionFictive, ...modification };
  return nutritionFictive;
}

import type { JourPastille } from './presentation';

/** Partie de `GET /programme` utilisée par Aujourd'hui (routes/athlete.js). */
export type SeanceProgramme = {
  id: string;
  date_prevue: string;
  type_seance: string;
  focus: string | null;
  duree_prevue_min: number | null;
  statut: string;
};

export type ProgrammeActif = {
  programme: { id: string; date_debut: string } | null;
  seances?: SeanceProgramme[];
};

export type SemaineAVenir = { numero: number; debut: string; premierJour: string; jours: JourPastille[] };

const MS_JOUR = 86_400_000;

/** Calcul de dates en UTC sur des dates ISO « AAAA-MM-JJ » (pas de décalage d'heure d'été). */
function versUtc(iso: string): number {
  const [a, m, j] = iso.split('-').map(Number);
  return Date.UTC(a, m - 1, j);
}
const versIso = (ms: number) => new Date(ms).toISOString().slice(0, 10);
export const ajouterJours = (iso: string, n: number) => versIso(versUtc(iso) + n * MS_JOUR);
export function lundiDe(iso: string): string {
  const jour = new Date(versUtc(iso)).getUTCDay();
  return ajouterJours(iso, -((jour + 6) % 7));
}

/**
 * Semaine du programme à montrer quand la semaine en cours est vide (programme pas encore commencé) :
 * la première semaine qui contient une séance à venir. `null` s'il n'y en a pas.
 */
export function premiereSemaineAVenir(donnees: ProgrammeActif | undefined, aujourdhui: string): SemaineAVenir | null {
  const debutProgramme = donnees?.programme?.date_debut;
  if (!debutProgramme) return null;
  const aVenir = (donnees?.seances ?? [])
    .filter((s) => s.date_prevue >= aujourdhui && s.statut !== 'annulee')
    .sort((a, b) => a.date_prevue.localeCompare(b.date_prevue));
  if (!aVenir.length) return null;
  const debut = lundiDe(aVenir[0].date_prevue);
  const jours: JourPastille[] = Array.from({ length: 7 }, (_, i) => {
    const date = ajouterJours(debut, i);
    return {
      date,
      aujourdhui: date === aujourdhui,
      seances: aVenir
        .filter((s) => s.date_prevue === date)
        .map((s) => ({ type: { code: s.type_seance, libelle: s.type_seance }, statut: { code: 'a_venir' as const } })),
    };
  });
  // Semaine 1 = celle de la toute première séance (un programme créé un samedi commence le lundi suivant).
  const premiere = (donnees?.seances ?? []).reduce((min, s) => (s.date_prevue < min ? s.date_prevue : min), aVenir[0].date_prevue);
  const numero = Math.floor((versUtc(debut) - versUtc(lundiDe(premiere))) / (7 * MS_JOUR)) + 1;
  return { numero: Math.max(1, numero), debut, premierJour: aVenir[0].date_prevue, jours };
}

/** Prochaine séance du programme à partir d'aujourd'hui (carte Repos). */
export function prochaineSeance(donnees: ProgrammeActif | undefined, aujourdhui: string): SeanceProgramme | null {
  return (
    (donnees?.seances ?? [])
      .filter((s) => s.date_prevue > aujourdhui && ['planifiee', 'generee'].includes(s.statut))
      .sort((a, b) => a.date_prevue.localeCompare(b.date_prevue))[0] ?? null
  );
}

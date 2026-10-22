/** Date du jour au format AAAA-MM-JJ, en heure locale du téléphone. */
export function dateDuJour(maintenant = new Date()): string {
  const m = String(maintenant.getMonth() + 1).padStart(2, '0');
  const j = String(maintenant.getDate()).padStart(2, '0');
  return `${maintenant.getFullYear()}-${m}-${j}`;
}

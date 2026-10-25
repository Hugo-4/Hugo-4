import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { GraphiqueBarres } from '@/components/GraphiqueBarres';

import { formatSemaineCourte, formatValeur } from '../format';
import type { ChargeSemaines } from '../types';

/** Au-delà de 8 semaines, une date sur deux sous les barres (la semaine en cours est toujours datée). */
const SEMAINES_TOUTES_DATEES = 8;

/** Barres de charge par semaine avec la zone optimale du serveur, et leur résumé en texte. */
export function GraphiqueCharge({ charge }: { charge: ChargeSemaines }) {
  const { t } = useTranslation();
  const { semaines, zone_optimale: zone, unite } = charge;
  const n = semaines.length;
  const derniere = semaines[n - 1];
  const resume =
    t('progres.charge.resume', {
      nombre: n,
      premiere: formatValeur(semaines[0].charge, unite),
      derniere: formatValeur(derniere.charge, unite),
    }) + (zone ? t('progres.charge.resumeZone', { min: formatValeur(zone.min), max: formatValeur(zone.max, unite) }) : '');

  return (
    <Card>
      <AppText variant="surTitre">{t('progres.charge.graphique')}</AppText>
      <GraphiqueBarres
        barres={semaines.map((s, i) => ({
          libelle: n <= SEMAINES_TOUTES_DATEES || i % 2 === (n - 1) % 2 ? formatSemaineCourte(s.debut) : '',
          valeur: s.charge,
          misEnAvant: s.en_cours,
        }))}
        zone={zone ?? undefined}
        resume={resume}
      />
      <AppText variant="libelle">{t(zone ? 'progres.charge.legendeZone' : 'progres.charge.legende')}</AppText>
    </Card>
  );
}

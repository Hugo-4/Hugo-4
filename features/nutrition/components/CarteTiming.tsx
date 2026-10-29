import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import type { NutritionJour } from '@/features/accueil/types';

import { formatCible, formatQuantite } from '../format';
import type { GroupeRepas } from '../useNutrition';
import type { MomentRepas } from '../types';
import { BlocMoment } from './BlocMoment';

type Props = { plan: NutritionJour; groupes: GroupeRepas[] };

/** Glucides et protéines autour de la séance du jour (plan du serveur) et ce qui a été noté à ces moments. */
export function CarteTiming({ plan, groupes }: Props) {
  const { t } = useTranslation();
  const n = plan.nutrition;
  const g = (v: [number, number]) => t('nutrition.valeurUnite', { valeur: formatCible(v), unite: t('nutrition.g') });
  const note = (moment: MomentRepas) => {
    const groupe = groupes.find((x) => x.moment === moment);
    if (!groupe) return null;
    return t('nutrition.timing.note', { glucides: formatQuantite(groupe.total.glucides), proteines: formatQuantite(groupe.total.proteines) });
  };
  const glucidesPendant = (v: number | string | [number, number]) =>
    v === 0 ? t('nutrition.timing.eauSeulement') : Array.isArray(v) ? t('nutrition.timing.glucidesHeure', { valeur: formatCible(v) }) : String(v);

  return (
    <Card>
      <AppText variant="surTitre">{t('nutrition.timing.titre')}</AppText>
      {!plan.seance || (!n.avant && !n.pendant && !n.apres) ? (
        <AppText variant="secondaire">{t('nutrition.timing.sansSeance')}</AppText>
      ) : null}
      {n.avant ? (
        <BlocMoment
          titre={t('nutrition.moments.pre_entrainement')}
          quand={n.avant.quand}
          lignes={[t('nutrition.timing.glucides', { valeur: g(n.avant.glucides_g) })]}
          idee={n.avant.idee}
          note={note('pre_entrainement')}
        />
      ) : null}
      {n.avant?.collation ? (
        <BlocMoment
          titre={t('nutrition.timing.collation')}
          quand={n.avant.collation.quand}
          lignes={[t('nutrition.timing.glucides', { valeur: g(n.avant.collation.glucides_g) })]}
          idee={n.avant.collation.idee}
        />
      ) : null}
      {n.pendant ? (
        <BlocMoment
          titre={t('nutrition.moments.pendant_entrainement')}
          lignes={[
            glucidesPendant(n.pendant.glucides_g_h),
            t('nutrition.timing.eauHeure', { valeur: formatCible(n.pendant.eau_ml_h) }),
            ...(n.pendant.sodium_mg_h ? [t('nutrition.timing.sodiumHeure', { valeur: formatCible(n.pendant.sodium_mg_h) })] : []),
          ]}
          note={note('pendant_entrainement')}
        />
      ) : null}
      {n.apres ? (
        <BlocMoment
          titre={t('nutrition.moments.post_entrainement')}
          quand={n.apres.quand}
          lignes={[t('nutrition.timing.glucides', { valeur: g(n.apres.glucides_g) }), t('nutrition.timing.proteines', { valeur: g(n.apres.proteines_g) })]}
          idee={n.apres.note}
          note={note('post_entrainement')}
        />
      ) : null}
      {n.hydratation?.apres ? <AppText variant="libelle">{n.hydratation.apres}</AppText> : null}
      {(n.consignes ?? []).map((c) => (
        <AppText key={c} variant="libelle">
          {c}
        </AppText>
      ))}
    </Card>
  );
}

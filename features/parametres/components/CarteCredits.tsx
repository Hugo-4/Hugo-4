import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { ProgressBar } from '@/components/ProgressBar';
import { LigneInfo } from '@/features/profil/components/LigneInfo';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import i18n from '@/lib/i18n';
import { formatDateEvenement, formatJourDate, formatNombre } from '@/lib/format';
import { spacing } from '@/theme/tokens';

import type { Credits } from '../types';

/** Crédits du mois : restants, jauge, renouvellement, utilisation (lecture seule). */
export function CarteCredits({ credits }: { credits: Credits }) {
  const { t } = useTranslation();
  const progression = credits.inclus > 0 ? credits.utilises / credits.inclus : 0;
  const libelleUsage = (type: string) => {
    const cle = `parametres.abonnement.usages.${type}`;
    return i18n.exists(cle) ? String(i18n.t(cle as never)) : type;
  };

  return (
    <SectionProfil titre={t('parametres.abonnement.credits')}>
      <View style={styles.solde}>
        <AppText variant="chiffre">{t('parametres.abonnement.restants', { count: credits.restants })}</AppText>
        <AppText variant="secondaire">{t('parametres.abonnement.surTotal', { total: formatNombre(credits.inclus) })}</AppText>
      </View>
      <ProgressBar
        progression={progression}
        accessibilityLabel={t('parametres.abonnement.a11yJauge', {
          utilises: formatNombre(credits.utilises),
          total: formatNombre(credits.inclus),
        })}
      />
      <AppText variant="libelle">
        {t('parametres.abonnement.periode', {
          debut: formatJourDate(credits.periode.debut),
          fin: formatJourDate(credits.periode.fin),
        })}
      </AppText>
      <AppText variant="secondaire">
        {t('parametres.abonnement.renouvellement', { date: formatDateEvenement(credits.renouvellement_le) })}
      </AppText>
      {credits.detail.length > 0 ? (
        <View style={styles.detail}>
          <AppText variant="corpsGras">{t('parametres.abonnement.utilisation')}</AppText>
          {credits.detail.map((d) => (
            <LigneInfo key={d.type} libelle={libelleUsage(d.type)} valeur={t('parametres.abonnement.nbCredits', { count: d.credits })} />
          ))}
        </View>
      ) : null}
    </SectionProfil>
  );
}

const styles = StyleSheet.create({
  solde: { gap: spacing.xxs },
  detail: { gap: spacing.s },
});

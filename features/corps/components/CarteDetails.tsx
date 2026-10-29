import { Activity } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { LigneListe } from '@/components/LigneListe';
import { formatDateJour, formatValeur } from '@/features/progres/format';
import { ouvrirVue } from '@/features/progres/navigation';
import { texteTest } from '@/features/questionnaire/textes';
import { colors, sizes } from '@/theme/tokens';

import type { DetailCorps } from '../useCorps';

/** Pour aller plus loin : fréquences cardiaques (et composition à partir de 18 ans quand elle sert). */
export function CarteDetails({ details }: { details: DetailCorps[] }) {
  const { t } = useTranslation();
  return (
    <Card>
      <AppText variant="surTitre">{t('corps.details')}</AppText>
      <AppText variant="secondaire">{t('corps.detailsAide')}</AppText>
      {details.map(({ slug, dernier }) => (
        <LigneListe
          key={slug}
          icon={<Activity color={colors.texte2} size={sizes.icone} />}
          titre={texteTest(t, slug)}
          sousTitre={dernier ? t('corps.mesureLe', { date: formatDateJour(dernier.date_test) }) : t('corps.ajouterMesure')}
          valeur={dernier ? formatValeur(dernier.valeur, dernier.types_tests?.unite) : undefined}
          // Ajout par la feuille « Ajouter un résultat » de Progrès, le test déjà choisi.
          onPress={() => ouvrirVue('tests', { ajouter: slug })}
        />
      ))}
    </Card>
  );
}

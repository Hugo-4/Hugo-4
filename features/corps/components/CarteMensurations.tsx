import { Ruler, Scale } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';
import { GraphiqueCourbe } from '@/components/GraphiqueCourbe';
import { LigneListe } from '@/components/LigneListe';
import { formatNombre } from '@/lib/format';
import { formatDateJour } from '@/features/progres/format';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { HistoriquePoids } from '../types';

type Props = {
  taille: number | null;
  poidsAutorise: boolean;
  /** Poids du profil (même sans historique de pesées). */
  poidsProfil: number | null;
  historique: HistoriquePoids | undefined;
  onTaille: () => void;
  onPoids: () => void;
};

const icone = { color: colors.texte2, size: sizes.icone };

/**
 * Taille et poids. Le poids est une donnée neutre (jamais un objectif, pas d'IMC affiché) : il sert au plan
 * nutrition du jour. Courbe des 60 derniers jours dès deux pesées.
 */
export function CarteMensurations({ taille, poidsAutorise, poidsProfil, historique, onTaille, onPoids }: Props) {
  const { t } = useTranslation();
  const kg = (v: number) => t('corps.kg', { valeur: formatNombre(v, 1) });
  const mesures = historique?.mesures ?? [];
  const derniere = historique?.tendance.derniere ?? null;
  const poids = derniere?.poids_kg ?? poidsProfil;

  return (
    <Card>
      <AppText variant="surTitre">{t('corps.mensurations')}</AppText>
      <LigneListe
        icon={<Ruler {...icone} />}
        titre={t('corps.taille.titre')}
        valeur={taille !== null ? t('corps.cm', { valeur: formatNombre(taille) }) : t('corps.aRenseigner')}
        onPress={onTaille}
      />
      {poidsAutorise ? (
        <>
          <LigneListe
            icon={<Scale {...icone} />}
            titre={t('corps.poids.titre')}
            sousTitre={derniere ? t('corps.poids.derniere', { date: formatDateJour(derniere.date) }) : t('corps.poids.ajouter')}
            valeur={poids !== null ? kg(poids) : t('corps.aRenseigner')}
            onPress={onPoids}
          />
          {mesures.length >= 2 ? (
            <View style={styles.courbe}>
              <GraphiqueCourbe
                points={mesures.map((m) => ({ libelle: formatDateJour(m.date_mesure), valeur: m.poids_kg }))}
                formatValeur={kg}
                resume={t('corps.poids.resume', {
                  nombre: mesures.length,
                  premiere: kg(mesures[0].poids_kg),
                  derniere: kg(mesures[mesures.length - 1].poids_kg),
                })}
              />
              {historique?.tendance.moyenne_7j != null ? (
                <AppText variant="secondaire">{t('corps.poids.moyenne', { valeur: kg(historique.tendance.moyenne_7j) })}</AppText>
              ) : null}
            </View>
          ) : null}
          <AppText variant="libelle">{t('corps.poids.aide')}</AppText>
        </>
      ) : (
        <AppText variant="libelle">{t('corps.poids.nonDemande')}</AppText>
      )}
    </Card>
  );
}

const styles = StyleSheet.create({
  courbe: { gap: spacing.s },
});

import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { sizes, spacing } from '@/theme/tokens';

import { cleExercice, exercicesDe, seanceTerminee, seriesPrevues, statutExercice } from '../etat';
import { mesureDe, pasCharge, saisieInitiale, type Saisie } from '../saisie';
import { useSeance } from '../SeanceProvider';
import { useActionsSeance } from '../useActionsSeance';
import { InfosExercice } from './InfosExercice';
import { MinuteurRepos } from './MinuteurRepos';
import { SaisieSerie } from './SaisieSerie';

type Props = {
  onFiche: () => void;
  onMenu: () => void;
  onTerminer: () => void;
};

/** Un exercice à la fois : saisie de la série en cours et gros bouton de validation en bas. */
export function VueExercice({ onFiche, onMenu, onTerminer }: Props) {
  const { t } = useTranslation();
  const { etat } = useSeance();
  const { validerSerie } = useActionsSeance();
  const exercice = exercicesDe(etat.seance)[etat.index];
  const cle = exercice ? cleExercice(exercice) : '';
  const faites = etat.series[cle]?.length ?? 0;
  const [saisie, setSaisie] = useState<Saisie | null>(null);

  // Nouvelle série ou nouvel exercice : on repart des valeurs préremplies (conseil du serveur compris).
  const suggestion = etat.suggestions[cle];
  useEffect(() => {
    if (exercice) setSaisie(saisieInitiale(etat, exercice));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cle, faites, suggestion]);

  if (!exercice || !saisie) return null;
  const statut = statutExercice(etat, exercice, etat.index);
  const enCours = statut === 'en_cours' || statut === 'a_faire';

  return (
    <View style={styles.ecran}>
      <ScrollView contentContainerStyle={styles.contenu}>
        <InfosExercice
          exercice={exercice}
          numeroSerie={Math.min(faites + 1, seriesPrevues(etat, exercice))}
          totalSeries={seriesPrevues(etat, exercice)}
          precedente={etat.series[cle]?.at(-1) ?? null}
          suggestion={suggestion ?? null}
          onFiche={onFiche}
          onMenu={onMenu}
        />
        <MinuteurRepos />
        {enCours ? (
          <SaisieSerie saisie={saisie} mesure={mesureDe(exercice)} pasCharge={pasCharge(exercice)} onChange={setSaisie} />
        ) : (
          <AppText variant="corpsGras">{t(`enSeance.statut.${statut}`)}</AppText>
        )}
      </ScrollView>
      <View style={styles.bas}>
        {enCours ? (
          <Button label={t('enSeance.valider')} onPress={() => validerSerie(saisie)} style={styles.valider} />
        ) : seanceTerminee(etat) ? (
          <Button label={t('enSeance.terminer')} onPress={onTerminer} style={styles.valider} />
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  ecran: { flex: 1 },
  contenu: { padding: spacing.ecran, gap: spacing.xl },
  bas: { paddingHorizontal: spacing.ecran, paddingBottom: spacing.s },
  valider: { minHeight: sizes.boutonSeance },
});

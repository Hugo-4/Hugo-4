import { router } from 'expo-router';
import { SearchX, X } from 'lucide-react-native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Button } from '@/components/Button';
import { EmptyState } from '@/components/EmptyState';
import { EtatsEcran } from '@/components/EtatsEcran';
import { IconButton } from '@/components/IconButton';
import { Screen } from '@/components/Screen';
import { Skeleton } from '@/components/Skeleton';
import { colors, radius, sizes, spacing } from '@/theme/tokens';

import { texteSection } from '../textes';
import { useParcoursBloc } from '../useParcoursBloc';
import { FinBloc } from './FinBloc';
import { QuestionEcran } from './QuestionEcran';

/** Un bloc (ou une section depuis le Profil) : une question par écran, « Enregistrer et quitter » toujours visible. */
export function EcranBloc({ cible }: { cible: string }) {
  const { t } = useTranslation();
  const p = useParcoursBloc(cible);
  const section = cible.split('-')[0];
  const suivant = p.blocSuivant;

  return (
    <Screen>
      <View style={styles.entete}>
        <AppText variant="sousTitre" style={styles.flex} numberOfLines={1}>
          {texteSection(t, section)}
        </AppText>
        {p.question && !p.fini ? (
          <Button label={t('questionnaire.question.quitter')} variant="discret" onPress={() => router.back()} />
        ) : (
          <IconButton accessibilityLabel={t('commun.fermer')} onPress={() => router.back()}>
            <X color={colors.texte} size={sizes.icone} />
          </IconButton>
        )}
      </View>
      <EtatsEcran
        chargement={!p.pret && !p.etat.donnees.error}
        erreur={p.etat.donnees.error}
        aDesDonnees={p.pret}
        onReessayer={p.etat.donnees.refetch}
        squelette={
          <View style={styles.squelette}>
            <Skeleton hauteur={sizes.cibleTactile} />
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} hauteur={sizes.cibleTactile + spacing.m} arrondi={radius.bouton} />
            ))}
          </View>
        }>
        {p.introuvable ? (
          <View style={styles.squelette}>
            <EmptyState icon={<SearchX color={colors.discret} size={sizes.icone * 2} />} titre={t('questionnaire.introuvable')} />
            <Button label={t('questionnaire.fin.retour')} variant="secondaire" onPress={() => router.back()} />
          </View>
        ) : p.fini ? (
          <FinBloc
            onSuivant={suivant ? () => router.replace({ pathname: '/questionnaire/[bloc]', params: { bloc: suivant.id } }) : null}
            onRetour={() => router.back()}
          />
        ) : p.question ? (
          <QuestionEcran
            key={p.question.id}
            question={p.question}
            valeurConnue={p.valeurConnue}
            numero={p.numero}
            total={p.total}
            enCours={p.envoi.isPending}
            erreur={p.envoi.error}
            onValider={(valeur) => p.enregistrer(valeur)}
            onPasser={() => p.enregistrer(null)}
          />
        ) : null}
      </EtatsEcran>
    </Screen>
  );
}

const styles = StyleSheet.create({
  entete: { flexDirection: 'row', alignItems: 'center', gap: spacing.s, paddingHorizontal: spacing.ecran, paddingTop: spacing.s },
  flex: { flex: 1 },
  squelette: { padding: spacing.ecran, gap: spacing.m },
});

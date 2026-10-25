import { router } from 'expo-router';
import { Dumbbell, Trophy } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Feuille } from '@/components/Feuille';
import { LigneListe } from '@/components/LigneListe';
import { libelleType } from '@/features/accueil/presentation';
import { dateLocale, formatDateLongue } from '@/lib/format';
import { colors, sizes } from '@/theme/tokens';

import { estSeanceProgramme, libelleIntensite, libelleStatutSeance } from '../presentation';
import type { JourCalendrier, Legende } from '../types';

type Props = {
  jour: JourCalendrier | null;
  legende?: Legende;
  onFermer: () => void;
};

/** Contenu d'un jour qui a plusieurs séances ou une compétition : chaque ligne ouvre son détail. */
export function FeuilleJour({ jour, legende, onFermer }: Props) {
  const { t } = useTranslation();
  const ouvrir = (aller: () => void) => {
    onFermer();
    aller();
  };
  return (
    <Feuille visible={jour !== null} titre={jour ? formatDateLongue(dateLocale(jour.date)) : ''} onFermer={onFermer}>
      {jour?.evenements.map((e) => (
        <LigneListe
          key={e.id}
          icon={<Trophy color={colors.accent} size={sizes.icone} />}
          titre={e.nom}
          sousTitre={t('programme.competitions.priorite', { priorite: e.priorite })}
          onPress={() => ouvrir(() => router.push({ pathname: '/programme/evenement/[id]', params: { id: e.id } }))}
        />
      ))}
      {jour?.seances.map((s) => {
        const sousTitre = [
          libelleType(s.type),
          libelleStatutSeance(s.statut),
          t('programme.intensite.court', { niveau: s.intensite.niveau, libelle: libelleIntensite(s.intensite.niveau, legende) }),
        ].join(' · ');
        const icone = <Dumbbell color={colors.texte2} size={sizes.icone} />;
        return estSeanceProgramme(s) ? (
          <LigneListe
            key={s.id}
            icon={icone}
            titre={s.titre}
            sousTitre={sousTitre}
            onPress={() => ouvrir(() => router.push({ pathname: '/programme/seance/[id]', params: { id: s.id } }))}
          />
        ) : (
          <LigneListe
            key={s.seance_id}
            icon={icone}
            titre={s.titre}
            sousTitre={t('programme.calendrier.horsProgramme', { details: sousTitre })}
          />
        );
      })}
    </Feuille>
  );
}

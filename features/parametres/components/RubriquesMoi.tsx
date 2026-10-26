import { router } from 'expo-router';
import { CalendarClock, Dumbbell, Target, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { LigneListe } from '@/components/LigneListe';
import { libelleReferentiel, texteLocal } from '@/features/inscription/libelles';
import type { Identite, SportAthlete } from '@/features/profil/types';
import { colors, sizes } from '@/theme/tokens';

import type { ReglageManquant } from '../useReglagesManquants';
import { GroupeRubriques } from './GroupeRubriques';

type Props = {
  identite: Identite | undefined;
  sports: SportAthlete[];
  manquants: ReglageManquant[];
};

const icone = { color: colors.texte2, size: sizes.icone };

/** Identité · Sports, ambitions et niveaux · Objectifs et compétitions · Disponibilités et lieux. */
export function RubriquesMoi({ identite, sports, manquants }: Props) {
  const { t } = useTranslation();
  const dispoManquante = manquants.includes('disponibilites');
  const titreDispos = t('parametres.profil.rubriques.disponibilites');

  const detailsSport = (sport: SportAthlete) =>
    [
      sport.role === 'principal' ? t('profil.sports.principal') : t('profil.sports.secondaire'),
      sport.niveau ? t(`inscription.niveau.${sport.niveau}.titre`) : null,
      sport.objectifs_sport
        ? texteLocal({ fr: sport.objectifs_sport.libelle_fr, en: sport.objectifs_sport.libelle_en })
        : sport.ambition
          ? t(`inscription.ambition.${sport.ambition}`)
          : null,
    ]
      .filter(Boolean)
      .join(' · ');

  return (
    <GroupeRubriques titre={t('parametres.profil.groupes.moi')}>
      <LigneListe
        icon={<User {...icone} />}
        titre={t('parametres.profil.rubriques.identite')}
        sousTitre={identite?.prenom ?? t('profil.nonRenseigne')}
        onPress={() => router.push('/compte/identite')}
      />
      <AppText variant="libelle" accessibilityRole="header">
        {t('parametres.profil.rubriques.sports')}
      </AppText>
      {sports.length === 0 ? (
        <LigneListe icon={<Dumbbell {...icone} />} titre={t('parametres.profil.aucunSport')} />
      ) : (
        sports.map((sport) => (
          <LigneListe
            key={sport.id}
            icon={<Dumbbell {...icone} />}
            titre={sport.sports ? libelleReferentiel('sports', sport.sports) : t('profil.sports.titre')}
            sousTitre={detailsSport(sport)}
            onPress={() => router.push({ pathname: '/compte/sport/[id]', params: { id: sport.id } })}
          />
        ))
      )}
      <LigneListe
        icon={<Target {...icone} />}
        titre={t('parametres.profil.rubriques.objectifs')}
        sousTitre={t('parametres.profil.sousTitres.objectifs')}
        onPress={() => router.push('/compte/objectifs')}
      />
      <LigneListe
        icon={<CalendarClock {...icone} />}
        titre={titreDispos}
        sousTitre={t('parametres.profil.sousTitres.disponibilites')}
        valeur={dispoManquante ? t('parametres.aCompleter') : undefined}
        accessibilityHint={dispoManquante ? t('parametres.profil.a11yACompleter', { rubrique: titreDispos }) : undefined}
        onPress={() => router.push('/compte/disponibilites')}
      />
    </GroupeRubriques>
  );
}

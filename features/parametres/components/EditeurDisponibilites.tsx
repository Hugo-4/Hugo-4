import { router } from 'expo-router';
import { CalendarClock, MapPin } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { BandeauHorsLigne } from '@/components/BandeauHorsLigne';
import { LigneListe } from '@/components/LigneListe';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { type Creneau, JOURS } from '@/features/inscription/constantes';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { colors, sizes, spacing } from '@/theme/tokens';

import type { Disponibilite, Lieu } from '../types';
import { useEnregistrerDisponibilites } from '../useDisponibilites';
import { useEditionDisponibilites } from '../useEditionDisponibilites';
import { FeuilleCreneau } from './FeuilleCreneau';
import { JourDisponibilites } from './JourDisponibilites';

type Props = {
  initiales: Disponibilite[];
  /** Lieux actifs ; `undefined` s'ils ne sont pas chargés (hors ligne, erreur) : l'écran reste utilisable. */
  lieux: Lieu[] | undefined;
  rafraichir: { actif: boolean; onRafraichir: () => void };
};

const AUCUN_LIEU: Lieu[] = [];

/** 7 jours × matin / midi / soir, durée et lieu de chaque créneau ; « Enregistrer » remplace tout (PUT). */
export function EditeurDisponibilites({ initiales, lieux: lieuxCharges, rafraichir }: Props) {
  const { t } = useTranslation();
  const edition = useEditionDisponibilites(initiales, lieuxCharges);
  const lieux = lieuxCharges ?? AUCUN_LIEU;
  const enregistrement = useEnregistrerDisponibilites();
  const [ouvert, setOuvert] = useState<{ jour: number; creneau: Creneau } | null>(null);
  const creneauOuvert = ouvert ? edition.lire(ouvert.jour, ouvert.creneau) : undefined;
  const nomJour = (jour: number) => t(`inscription.dispos.joursLongs.${jour as 1 | 2 | 3 | 4 | 5 | 6 | 7}`);

  return (
    <EcranEdition
      titre={t('parametres.disponibilites.titre')}
      rafraichir={rafraichir}
      enregistrementActif={edition.modifie && !enregistrement.isPending}
      onEnregistrer={() =>
        enregistrement.mutate(edition.corps, { onSuccess: (_reponse, envoye) => edition.enregistre(envoye) })
      }
      bandeau={
        enregistrement.isError ? (
          <ErreurEnregistrement erreur={enregistrement.error} />
        ) : enregistrement.isSuccess && !edition.modifie ? (
          <AppText variant="corpsGras" color={colors.accent} accessibilityLiveRegion="polite">
            {t('parametres.disponibilites.enregistrees')}
          </AppText>
        ) : null
      }>
      <BandeauHorsLigne />
      <LigneListe
        icon={<MapPin color={colors.texte2} size={sizes.icone} />}
        titre={t('parametres.disponibilites.mesLieux')}
        valeur={lieux.length ? t('parametres.disponibilites.lieux', { count: lieux.length }) : t('parametres.disponibilites.aucunLieu')}
        onPress={() => router.push('/compte/lieux')}
      />
      {edition.nombre === 0 ? (
        <Bandeau
          icon={<CalendarClock color={colors.alerte} size={sizes.iconePetite} />}
          ton="alerte"
          texte={t('parametres.disponibilites.aucune')}
        />
      ) : null}
      {edition.lieuxRetires ? (
        <Bandeau
          icon={<MapPin color={colors.texte2} size={sizes.iconePetite} />}
          texte={t('parametres.disponibilites.lieuxRetires')}
        />
      ) : null}
      <AppText variant="secondaire">{t('parametres.disponibilites.aide')}</AppText>
      <View style={styles.grille}>
        {JOURS.map((jour) => (
          <JourDisponibilites
            key={jour}
            jour={jour}
            lire={edition.lire}
            lieux={lieux}
            onBasculer={(creneau) => edition.basculer(jour, creneau)}
            onRegler={(creneau) => setOuvert({ jour, creneau })}
          />
        ))}
      </View>
      {ouvert && creneauOuvert ? (
        <FeuilleCreneau
          creneau={creneauOuvert}
          titre={t('parametres.disponibilites.reglerCreneau', {
            jour: nomJour(ouvert.jour),
            creneau: t(`inscription.dispos.creneaux.${ouvert.creneau}`),
          })}
          lieux={lieux}
          onFermer={() => setOuvert(null)}
          onValider={(changement) => {
            edition.modifier(ouvert.jour, ouvert.creneau, changement);
            setOuvert(null);
          }}
          onRetirer={() => {
            edition.basculer(ouvert.jour, ouvert.creneau);
            setOuvert(null);
          }}
        />
      ) : null}
    </EcranEdition>
  );
}

const styles = StyleSheet.create({
  grille: { gap: spacing.xs },
});

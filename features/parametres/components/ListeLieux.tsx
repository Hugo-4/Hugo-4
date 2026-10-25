import { router } from 'expo-router';
import { MapPin } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { Button } from '@/components/Button';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { ErreurEnregistrement } from '@/features/inscription/components/ErreurEnregistrement';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import { colors, radius, sizes } from '@/theme/tokens';

import { confirmer } from '../confirmer';
import type { Lieu } from '../types';
import { useLieuParDefaut, useListeLieux, useSupprimerLieu } from '../useLieux';
import { CarteLieu } from './CarteLieu';

/** Mes lieux : liste, lieu par défaut, suppression (confirmée), accès à l'ajout et à la modification (`?id=…`). */
export function ListeLieux() {
  const { t } = useTranslation();
  const lieux = useListeLieux();
  const parDefaut = useLieuParDefaut();
  const suppression = useSupprimerLieu();
  const erreur = parDefaut.error ?? suppression.error;
  const supprimer = (lieu: Lieu) =>
    confirmer({
      titre: t('parametres.lieux.confirmerTitre', { nom: lieu.nom }),
      texte: t('parametres.lieux.confirmerTexte'),
      action: t('parametres.lieux.confirmer'),
      onConfirmer: () => suppression.mutate(lieu.id),
    });
  const ouvrir = (id: string) => router.push({ pathname: '/compte/lieux', params: { id } });
  const ajouter = <Button label={t('parametres.lieux.ajouter')} onPress={() => ouvrir('nouveau')} />;
  const liste = lieux.data ?? [];

  return (
    <EcranEdition
      titre={t('parametres.lieux.titre')}
      rafraichir={{ actif: lieux.isRefetching, onRafraichir: lieux.refetch }}
      bandeau={erreur ? <ErreurEnregistrement erreur={erreur} /> : undefined}>
      <EtatsEcran
        chargement={lieux.isPending}
        erreur={lieux.error}
        aDesDonnees={lieux.data !== undefined}
        vide={liste.length === 0}
        onReessayer={lieux.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme} arrondi={radius.carte} />}
        etatVide={{
          icon: <MapPin color={colors.discret} size={sizes.icone * 2} />,
          titre: t('parametres.lieux.videTitre'),
          texte: t('parametres.lieux.videTexte'),
          action: ajouter,
        }}>
        {liste.map((lieu) => (
          <CarteLieu
            key={lieu.id}
            lieu={lieu}
            onModifier={() => ouvrir(lieu.id)}
            onParDefaut={() => parDefaut.mutate(lieu.id)}
            onSupprimer={() => supprimer(lieu)}
            enCours={parDefaut.isPending || suppression.isPending}
          />
        ))}
        {ajouter}
      </EtatsEcran>
    </EcranEdition>
  );
}

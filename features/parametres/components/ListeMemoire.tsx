import { router } from 'expo-router';
import { Brain } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { Bandeau } from '@/components/Bandeau';
import { Button } from '@/components/Button';
import { EtatsEcran } from '@/components/EtatsEcran';
import { Skeleton } from '@/components/Skeleton';
import { EcranEdition } from '@/features/profil/components/EcranEdition';
import i18n from '@/lib/i18n';
import { colors, radius, sizes } from '@/theme/tokens';

import { useSouvenirsVisibles } from '../useMemoire';
import { GroupeRubriques } from './GroupeRubriques';
import { LigneSouvenir } from './LigneSouvenir';

const nomCategorie = (categorie: string) => {
  const cle = `parametres.memoire.categories.${categorie}`;
  return i18n.exists(cle) ? String(i18n.t(cle as never)) : categorie;
};

/** « Ce que le coach a retenu », par catégorie (souvenirs de santé masqués sans consentement). */
export function ListeMemoire() {
  const { t } = useTranslation();
  const { memoire, avecSante, visibles, groupes } = useSouvenirsVisibles();

  return (
    <EcranEdition titre={t('parametres.memoire.titre')} rafraichir={{ actif: memoire.isRefetching, onRafraichir: memoire.refetch }}>
      <AppText variant="secondaire">{t('parametres.memoire.intro')}</AppText>
      {!avecSante ? (
        <>
          <Bandeau texte={t('parametres.memoire.santeMasquee')} />
          <Button
            label={t('parametres.sante.voirConsentements')}
            variant="discret"
            onPress={() => router.push('/compte/consentements')}
          />
        </>
      ) : null}
      <EtatsEcran
        chargement={memoire.isPending}
        erreur={memoire.error}
        aDesDonnees={memoire.data !== undefined}
        vide={visibles.length === 0}
        onReessayer={memoire.refetch}
        squelette={<Skeleton hauteur={sizes.anneauForme * 2} arrondi={radius.carte} />}
        etatVide={{
          icon: <Brain color={colors.discret} size={sizes.icone * 2} />,
          titre: t('parametres.memoire.videTitre'),
          texte: t('parametres.memoire.videTexte'),
        }}>
        {groupes.map((groupe) => (
          <GroupeRubriques key={groupe.categorie} titre={nomCategorie(groupe.categorie)}>
            {groupe.souvenirs.map((s) => (
              <LigneSouvenir
                key={s.id}
                souvenir={s}
                onOuvrir={() => router.push({ pathname: '/compte/memoire', params: { id: s.id } })}
              />
            ))}
          </GroupeRubriques>
        ))}
      </EtatsEcran>
    </EcranEdition>
  );
}

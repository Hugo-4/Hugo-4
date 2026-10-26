import { router } from 'expo-router';
import { Brain, Database, HeartPulse, ShieldCheck } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { LigneListe } from '@/components/LigneListe';
import type { EtatConsentement, TypeConsentement } from '@/features/profil/types';
import { colors, sizes } from '@/theme/tokens';

import type { ReglageManquant } from '../useReglagesManquants';
import { GroupeRubriques } from './GroupeRubriques';

type Props = {
  avecSante: boolean;
  consentements: Partial<Record<TypeConsentement, EtatConsentement>>;
  manquants: ReglageManquant[];
};

const icone = { color: colors.texte2, size: sizes.icone };

/** Santé (seulement avec le consentement) · Consentements · Ce que le coach a retenu · Mes données. */
export function RubriquesConfidentialite({ avecSante, consentements, manquants }: Props) {
  const { t } = useTranslation();
  const cguManquantes = manquants.includes('cgu');
  const titreConsentements = t('parametres.profil.rubriques.consentements');
  const etatSante = consentements.donnees_sante?.accorde
    ? t('parametres.profil.sousTitres.consentementsAvecSante')
    : t('parametres.profil.sousTitres.consentementsSansSante');

  return (
    <GroupeRubriques titre={t('parametres.profil.groupes.confidentialite')}>
      {avecSante ? (
        <LigneListe
          icon={<HeartPulse {...icone} />}
          titre={t('parametres.profil.rubriques.sante')}
          sousTitre={t('parametres.profil.sousTitres.sante')}
          onPress={() => router.push('/compte/sante')}
        />
      ) : null}
      <LigneListe
        icon={<ShieldCheck {...icone} />}
        titre={titreConsentements}
        sousTitre={etatSante}
        valeur={cguManquantes ? t('parametres.aCompleter') : undefined}
        accessibilityHint={
          cguManquantes ? t('parametres.profil.a11yACompleter', { rubrique: titreConsentements }) : undefined
        }
        onPress={() => router.push('/compte/consentements')}
      />
      <LigneListe
        icon={<Brain {...icone} />}
        titre={t('parametres.profil.rubriques.memoire')}
        sousTitre={t('parametres.profil.sousTitres.memoire')}
        onPress={() => router.push('/compte/memoire')}
      />
      <LigneListe
        icon={<Database {...icone} />}
        titre={t('parametres.profil.rubriques.donnees')}
        sousTitre={t('parametres.profil.sousTitres.donnees')}
        onPress={() => router.push('/compte/donnees')}
      />
    </GroupeRubriques>
  );
}

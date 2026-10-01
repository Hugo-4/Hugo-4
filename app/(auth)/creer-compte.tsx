import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AuthForm } from '@/features/auth/components/AuthForm';
import { EmailEnvoye } from '@/features/auth/components/EmailEnvoye';
import { cleErreurAuth } from '@/features/auth/erreurs';
import { useCreationCompte } from '@/features/auth/useAuthActions';

export default function CreerCompteScreen() {
  const { t } = useTranslation();
  const creation = useCreationCompte();

  // Compte créé mais email à confirmer avant de pouvoir se connecter.
  if (creation.data === false) {
    return <EmailEnvoye email={creation.variables.email.trim()} onConnexion={() => router.replace('/connexion')} />;
  }

  return (
    <AuthForm
      nouveauCompte
      titre={t('auth.creerCompte.titre')}
      sousTitre={t('auth.creerCompte.sousTitre')}
      libelleBouton={t('auth.creerCompte.bouton')}
      enCours={creation.isPending}
      erreurServeur={creation.error ? t(cleErreurAuth(creation.error)) : undefined}
      onEnvoyer={(email, motDePasse) => creation.mutate({ email, motDePasse })}
      lienTexte={t('auth.creerCompte.dejaCompte')}
      lienLibelle={t('auth.creerCompte.seConnecter')}
      onLien={() => router.replace('/connexion')}
    />
  );
}

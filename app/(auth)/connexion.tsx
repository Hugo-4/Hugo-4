import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

import { AuthForm } from '@/features/auth/components/AuthForm';
import { cleErreurAuth } from '@/features/auth/erreurs';
import { useConnexion } from '@/features/auth/useAuthActions';

export default function ConnexionScreen() {
  const { t } = useTranslation();
  const connexion = useConnexion();

  return (
    <AuthForm
      titre={t('auth.connexion.titre')}
      sousTitre={t('auth.connexion.sousTitre')}
      libelleBouton={t('auth.connexion.bouton')}
      enCours={connexion.isPending}
      erreurServeur={connexion.error ? t(cleErreurAuth(connexion.error)) : undefined}
      onEnvoyer={(email, motDePasse) => connexion.mutate({ email, motDePasse })}
      lienTexte={t('auth.connexion.pasDeCompte')}
      lienLibelle={t('auth.connexion.creerCompte')}
      onLien={() => router.replace('/creer-compte')}
    />
  );
}

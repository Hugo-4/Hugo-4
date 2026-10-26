import { AppText } from '@/components/AppText';
import { Card } from '@/components/Card';

/** Bloc titré qui affiche un texte du serveur tel quel (objectif, consignes). */
export function SectionTexte({ titre, texte }: { titre: string; texte: string | null | undefined }) {
  if (!texte) return null;
  return (
    <Card>
      <AppText variant="surTitre" accessibilityRole="header">
        {titre}
      </AppText>
      <AppText variant="corps">{texte}</AppText>
    </Card>
  );
}

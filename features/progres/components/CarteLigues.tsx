import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';

import type { EtatSection } from '../etats';
import { PROGRES_FICTIF } from '../source';
import type { LiguesDefis } from '../types';
import { CarteSection } from './CarteSection';
import { LigneDefi } from './LigneDefi';

type Props = {
  ligues: LiguesDefis | undefined;
  etat: EtatSection;
  onReessayer: () => void;
  onPress: () => void;
};

/** Ligues et défis (affichée seulement à partir de 15 ans : c'est l'écran qui décide de la montrer). */
export function CarteLigues({ ligues, etat, onReessayer, onPress }: Props) {
  const { t } = useTranslation();
  const rejointes = ligues?.ligues.filter((l) => l.inscrit).length ?? 0;
  const defis = ligues?.defis.filter((d) => d.statut === 'en_cours') ?? [];
  const vide = !ligues || (ligues.ligues.length === 0 && defis.length === 0);

  return (
    <CarteSection
      titre={t('progres.ligues.titre')}
      etat={etat}
      onReessayer={onReessayer}
      onPress={vide ? undefined : onPress}
      exemple={PROGRES_FICTIF}>
      {vide ? (
        <AppText variant="secondaire">{t('progres.ligues.videTexte')}</AppText>
      ) : (
        <>
          <AppText variant="secondaire">
            {t('progres.ligues.resume', {
              ligues: t('progres.ligues.rejointes', { count: rejointes }),
              defis: t('progres.ligues.defisEnCours', { count: defis.length }),
            })}
          </AppText>
          {defis[0] ? <LigneDefi defi={defis[0]} /> : null}
        </>
      )}
    </CarteSection>
  );
}

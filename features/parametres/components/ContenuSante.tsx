import { useTranslation } from 'react-i18next';

import { AppText } from '@/components/AppText';
import { LigneInfo } from '@/features/profil/components/LigneInfo';
import { SectionProfil } from '@/features/profil/components/SectionProfil';
import i18n from '@/lib/i18n';
import { formatDateCourte } from '@/lib/format';

import type { DonneesSante } from '../useSante';

/** Libellé traduit d'un code de la base (zone, côté, gravité), sinon le code tel quel. */
function libelle(groupe: string, code: string | null): string | null {
  if (!code) return null;
  const cle = `inscription.${groupe}.${code}`;
  return i18n.exists(cle) ? String(i18n.t(cle as never)) : code;
}

const date = (iso: string | null) => (iso && /^\d{4}-\d{2}-\d{2}/.test(iso) ? formatDateCourte(iso.slice(0, 10)) : null);

/** Blessures actives et rééducation en cours (lecture seule). */
export function ContenuSante({ donnees }: { donnees: DonneesSante }) {
  const { t } = useTranslation();
  return (
    <>
      <SectionProfil titre={t('parametres.sante.blessures')}>
        {donnees.blessures.length === 0 ? (
          <AppText variant="secondaire">{t('parametres.sante.aucuneBlessure')}</AppText>
        ) : (
          donnees.blessures.map((b, i) => {
            const depuis = date(b.depuis);
            return (
              <LigneInfo
                key={`${b.zone}-${i}`}
                libelle={libelle('zones', b.zone) ?? t('parametres.sante.inconnue')}
                valeur={[b.type, depuis ? t('parametres.sante.depuis', { date: depuis }) : null].filter(Boolean).join(' · ')}
              />
            );
          })
        )}
      </SectionProfil>
      <SectionProfil titre={t('parametres.sante.reeducation')}>
        {donnees.reeducations.length === 0 ? (
          <AppText variant="secondaire">{t('parametres.sante.aucuneReeducation')}</AppText>
        ) : (
          donnees.reeducations.map((r) => {
            const debut = date(r.date_debut_protocole);
            return (
              <LigneInfo
                key={r.id}
                libelle={
                  [libelle('zones', r.zone_anatomique), libelle('douleurs.cotes', r.cote)].filter(Boolean).join(' · ') ||
                  (r.blessure_type ?? t('parametres.sante.inconnue'))
                }
                valeur={[
                  r.blessure_type,
                  libelle('douleurs.gravites', r.gravite),
                  r.phase_actuelle ? t('parametres.sante.phase', { phase: r.phase_actuelle }) : null,
                  debut ? t('parametres.sante.debut', { date: debut }) : null,
                ]
                  .filter(Boolean)
                  .join(' · ')}
              />
            );
          })
        )}
      </SectionProfil>
      <AppText variant="libelle">{t('parametres.sante.signaler')}</AppText>
    </>
  );
}

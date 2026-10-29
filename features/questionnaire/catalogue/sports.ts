import { JOURS_SEMAINE, sport } from '../destinations';
import type { Question, SportSlug } from '../types';

/** Question d'un bloc de sport : la réponse va dans `user_sport_profiles.profil_specifique.<cle>`. */
function q(id: string, cle: string, type: 'unique' | 'multiple' | 'nombre', options?: readonly string[], extra: Partial<Question> = {}): Question {
  return { id, section: 'sport', type, options, destination: sport(cle), ...extra };
}

const CLUB = (id: string) => q(id, 'club_jours', 'multiple', [...JOURS_SEMAINE, 'aucun']);

const COURSE: Question[] = [
  q('CO03', 'km_semaine_actuel', 'unique', ['km0', 'km_moins_10', 'km10_20', 'km20_40', 'km40_60', 'km60_80', 'km_plus_80']),
  q('CO04', 'sortie_longue_max', 'nombre', undefined, { nombre: { min: 0, max: 200, unite: 'km' } }),
  q('CO06', 'experience_fractionne', 'unique', ['jamais', 'parfois', 'chaque_semaine']),
  q('CO07', 'terrains', 'multiple', ['route', 'chemins', 'piste', 'tapis']),
  CLUB('CO10'),
];

/** Blocs par sport (questions du parcours Complet), dans l'ordre du questionnaire. */
const BLOCS: Record<SportSlug, Question[]> = {
  musculation: [
    q('MU03', 'split_actuel', 'unique', ['corps_entier', 'haut_bas', 'push_pull_legs', 'un_muscle', 'aucun_programme']),
    q('MU06', 'maitrise_technique', 'multiple', ['squat_barre', 'souleve_terre', 'developpe_couche', 'olympiques', 'aucun']),
    q('MU07', 'habitude_echec', 'unique', ['jamais', 'parfois', 'souvent']),
    q('MU08', 'muscles_prioritaires', 'multiple', ['pectoraux', 'dos', 'epaules', 'bras', 'abdos', 'fessiers', 'cuisses', 'mollets'], { max: 3 }),
  ],
  course_a_pied: COURSE,
  trail: [
    ...COURSE,
    q('TR03', 'd_plus_semaine', 'unique', ['dplus0', 'dplus_moins_500', 'dplus500_1500', 'dplus_plus_1500']),
    q('TR05', 'batons', 'unique', ['oui', 'non', 'apprendre']),
    q('TR06', 'descente', 'unique', ['a_l_aise', 'prudent', 'douleurs']),
    q('TR07', 'acces_denivele', 'multiple', ['montagne', 'collines', 'escaliers', 'tapis_incline', 'aucun']),
  ],
  cyclisme: [
    q('CY03', 'heures_semaine_actuel', 'unique', ['h0', 'h_moins_3', 'h3_6', 'h6_10', 'h_plus_10']),
    q('CY04', 'sortie_longue_max', 'nombre', undefined, { nombre: { min: 0, max: 400, unite: 'km' } }),
    q('CY05', 'mesure', 'multiple', ['capteur_puissance', 'ceinture_cardio', 'home_trainer', 'compteur_gps', 'aucun']),
    q('CY07', 'terrain', 'unique', ['plat', 'vallonne', 'montagne']),
    CLUB('CY09'),
  ],
  natation: [
    q('NA01', 'niveau_crawl', 'unique', ['ne_sait_pas', 'm25', 'm200', 'm400', 'plus_1500']),
    q('NA02', 'nages', 'multiple', ['crawl', 'dos', 'brasse', 'papillon', 'virage_culbute']),
    q('NA04', 'km_semaine_actuel', 'unique', ['km0', 'km_moins_2', 'km2_5', 'km5_10', 'km_plus_10']),
    q('NA07', 'materiel_natation', 'multiple', ['plaquettes', 'pull_buoy', 'palmes', 'planche', 'tuba', 'combinaison', 'aucun']),
    CLUB('NA08'),
  ],
  triathlon: [
    q('TRI03', 'discipline_faible', 'unique', ['natation', 'velo', 'course']),
    q('TRI04', 'heures_semaine_actuel', 'unique', ['h_moins_4', 'h4_8', 'h8_12', 'h_plus_12']),
    q('TRI05', 'enchainements', 'unique', ['jamais', 'parfois', 'souvent']),
    q('TRI07', 'velo', 'unique', ['route', 'clm', 'les_deux']),
  ],
  boxe_anglaise: [
    q('BX01', 'garde', 'unique', ['orthodoxe', 'fausse_garde', 'les_deux']),
    q('BX02', 'pratique', 'unique', ['loisir', 'educative', 'amateur', 'professionnelle']),
    q('BX06', 'sparring', 'unique', ['jamais', 'leger', 'regulier']),
    CLUB('BX07'),
    q('BX08A', 'points_forts', 'multiple', ['explosivite', 'cardio', 'jeu_jambes', 'defense', 'puissance', 'enchainements'], { max: 2 }),
    q('BX08B', 'points_faibles', 'multiple', ['explosivite', 'cardio', 'jeu_jambes', 'defense', 'puissance', 'enchainements'], { max: 2 }),
    q('BX11', 'materiel_combat', 'multiple', ['sac', 'poire', 'pao', 'corde', 'gants', 'casque', 'protege_dents', 'aucun']),
  ],
  mma: [
    q('MM01', 'pratique', 'unique', ['loisir', 'amateur', 'pro']),
    q('MM02', 'style_base', 'multiple', ['boxe', 'kick_boxing', 'muay_thai', 'lutte', 'judo', 'jjb', 'karate', 'aucun']),
    q('MM07', 'garde', 'unique', ['orthodoxe', 'fausse_garde', 'les_deux']),
    q('MM06', 'plan_jeu', 'unique', ['debout_frappe', 'amener_sol', 'controle_cage', 'soumettre']),
    CLUB('MM05'),
    q('BX06', 'sparring', 'unique', ['jamais', 'leger', 'regulier']),
  ],
  football: [
    q('FO02', 'championnat', 'unique', ['loisir', 'district', 'regional', 'national', 'pro']),
    q('FO04', 'jour_match', 'unique', [...JOURS_SEMAINE]),
    q('FO05', 'temps_de_jeu', 'unique', ['rarement', 'moins_45', 'min45_70', 'tout_le_match']),
    q('FO06', 'phase_saison', 'unique', ['preparation', 'saison', 'treve', 'intersaison']),
    q('FO07', 'pied_fort', 'unique', ['droit', 'gauche', 'les_deux']),
    q('FO08', 'priorites', 'multiple', ['vitesse', 'endurance', 'repetition_sprints', 'duels', 'detente', 'prevention'], { max: 3 }),
    q('FO09', 'prevention_11plus', 'unique', ['oui', 'non']),
    CLUB('FO03'),
  ],
  general: [
    q('GE01', 'priorites', 'multiple', ['energie', 'moins_douleurs', 'souffle', 'force', 'perdre_gras'], { max: 2 }),
    q('GE02', 'autonomie_physique', 'multiple', ['trois_etages', 'relever_sol', 'aucun']),
  ],
};

export const questionsSport = (sportPrincipal: SportSlug | null): Question[] => BLOCS[sportPrincipal ?? 'general'];

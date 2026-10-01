import { getLocales } from 'expo-localization';
import { createInstance } from 'i18next';
import { initReactI18next } from 'react-i18next';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json';

export const LANGUES = ['fr', 'en'] as const;
export type Langue = (typeof LANGUES)[number];

/** Les deux fichiers doivent avoir exactement les mêmes clés : tsc échoue sinon. */
const enComplet: typeof fr = en;

function langueDuTelephone(): Langue {
  for (const locale of getLocales()) {
    const code = locale.languageCode;
    if (code && (LANGUES as readonly string[]).includes(code)) {
      return code as Langue;
    }
  }
  return 'en';
}

export const resources = {
  fr: { translation: fr },
  en: { translation: enComplet },
} as const;

const i18n = createInstance();

i18n.use(initReactI18next).init({
  resources,
  lng: langueDuTelephone(),
  fallbackLng: 'en',
  supportedLngs: LANGUES,
  interpolation: { escapeValue: false },
  returnNull: false,
});

export default i18n;

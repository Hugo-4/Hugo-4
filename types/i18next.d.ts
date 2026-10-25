import 'i18next';

import type { Traductions } from '@/locales';

declare module 'i18next' {
  interface CustomTypeOptions {
    defaultNS: 'translation';
    resources: { translation: Traductions };
  }
}

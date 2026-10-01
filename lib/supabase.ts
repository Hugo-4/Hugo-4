import { createClient } from '@supabase/supabase-js';
import { AppState, Platform } from 'react-native';

import { env } from './env';
import { secureStorage } from './secureStorage';

/** Client Supabase unique : authentification et lectures simples protégées par RLS. */
export const supabase = createClient(env.supabaseUrl, env.supabaseAnonKey, {
  auth: {
    storage: secureStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

// Le jeton n'est rafraîchi automatiquement que lorsque l'app est au premier plan.
if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (etat) => {
    if (etat === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}

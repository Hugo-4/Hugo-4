import { Tabs } from 'expo-router';
import { BarChart3, Calendar, Sun, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { TabBar } from '@/components/TabBar';
import { EnvoiEnFond } from '@/features/seance/components/EnvoiEnFond';
import { colors } from '@/theme/tokens';

/** Onglets (FRONTEND.md §3.1) : Aujourd'hui · Programme · Coach (central) · Progrès · Profil. */
export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <>
      <EnvoiEnFond />
      <Tabs
        tabBar={(props) => <TabBar {...props} />}
        // « Retour » depuis le Coach ramène à l'onglet d'où on l'a ouvert (Programme, Aujourd'hui…).
        backBehavior="history"
        screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.fond } }}>
        <Tabs.Screen
          name="index"
          options={{
            title: t('onglets.aujourdhui'),
            tabBarIcon: ({ color, size }) => <Sun color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="programme"
          options={{
            title: t('onglets.programme'),
            tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />,
          }}
        />
        <Tabs.Screen name="coach" options={{ title: t('onglets.coach') }} />
        <Tabs.Screen
          name="progres"
          options={{
            title: t('onglets.progres'),
            tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
          }}
        />
        <Tabs.Screen
          name="profil"
          options={{
            title: t('onglets.profil'),
            tabBarIcon: ({ color, size }) => <User color={color} size={size} />,
          }}
        />
      </Tabs>
    </>
  );
}

import { Tabs } from 'expo-router';
import { CalendarDays, House, TrendingUp, User } from 'lucide-react-native';
import { useTranslation } from 'react-i18next';

import { TabBar } from '@/components/TabBar';
import { colors } from '@/theme/tokens';

export default function TabsLayout() {
  const { t } = useTranslation();

  return (
    <Tabs
      tabBar={(props) => <TabBar {...props} />}
      screenOptions={{ headerShown: false, sceneStyle: { backgroundColor: colors.fond } }}>
      <Tabs.Screen
        name="index"
        options={{
          title: t('onglets.aujourdhui'),
          tabBarIcon: ({ color, size }) => <House color={color} size={size} />,
        }}
      />
      <Tabs.Screen
        name="programme"
        options={{
          title: t('onglets.programme'),
          tabBarIcon: ({ color, size }) => <CalendarDays color={color} size={size} />,
        }}
      />
      <Tabs.Screen name="coach" options={{ title: t('onglets.coach') }} />
      <Tabs.Screen
        name="progres"
        options={{
          title: t('onglets.progres'),
          tabBarIcon: ({ color, size }) => <TrendingUp color={color} size={size} />,
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
  );
}

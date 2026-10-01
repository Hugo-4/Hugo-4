import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';

import { colors, sizes, spacing } from '@/theme/tokens';

import { CoachTabButton } from './CoachTabButton';
import { TabBarItem } from './TabBarItem';

export const ROUTE_COACH = 'coach';

/** Barre d'onglets : quatre onglets classiques et le bouton Coach surélevé au centre. */
export function TabBar({ state, descriptors, navigation, insets }: BottomTabBarProps) {
  return (
    <View style={[styles.barre, { paddingBottom: Math.max(insets.bottom, spacing.s) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const actif = state.index === index;
        const label = typeof options.title === 'string' ? options.title : route.name;

        const onPress = () => {
          const event = navigation.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!actif && !event.defaultPrevented) {
            navigation.navigate(route.name, route.params);
          }
        };

        if (route.name === ROUTE_COACH) {
          return <CoachTabButton key={route.key} label={label} actif={actif} onPress={onPress} />;
        }

        return (
          <TabBarItem
            key={route.key}
            label={label}
            actif={actif}
            onPress={onPress}
            renderIcon={(couleur) => options.tabBarIcon?.({ focused: actif, color: couleur, size: sizes.icone })}
          />
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  barre: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: colors.fond,
    borderTopWidth: sizes.bordure,
    borderTopColor: colors.ligne,
    paddingTop: spacing.s,
    paddingHorizontal: spacing.xs,
  },
});

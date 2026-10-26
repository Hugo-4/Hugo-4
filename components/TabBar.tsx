import type { BottomTabBarProps } from 'expo-router/js-tabs';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';

import { useBadges } from '@/features/notifications/useBadges';
import { colors, sizes, spacing } from '@/theme/tokens';

import { CoachTabButton } from './CoachTabButton';
import { TabBarItem } from './TabBarItem';

export const ROUTE_COACH = 'coach';

/**
 * Barre d'onglets : quatre onglets classiques et le bouton Coach surélevé au centre.
 * Masquée dans le chat du Coach (FRONTEND.md §3.1) : l'en-tête du chat a son bouton retour.
 */
export function TabBar({ state, descriptors, emitter, navigateToTab, insets }: BottomTabBarProps) {
  const { t } = useTranslation();
  const badges = useBadges();
  if (state.routes[state.index]?.name === ROUTE_COACH) return null;
  return (
    <View accessibilityRole="tablist" style={[styles.barre, { paddingBottom: Math.max(insets.bottom, spacing.s) }]}>
      {state.routes.map((route, index) => {
        const { options } = descriptors[route.key];
        const actif = state.index === index;
        const label = typeof options.title === 'string' ? options.title : route.name;

        const onPress = () => {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!actif && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        };

        if (route.name === ROUTE_COACH) {
          return (
            <CoachTabButton
              key={route.key}
              label={label}
              actif={actif}
              onPress={onPress}
              badge={badges.coach ? t('notifications.badgeCoach') : null}
            />
          );
        }

        return (
          <TabBarItem
            key={route.key}
            label={label}
            actif={actif}
            onPress={onPress}
            renderIcon={(couleur) => options.tabBarIcon?.({ focused: actif, color: couleur, size: sizes.icone })}
            badge={route.name === 'profil' && badges.profil ? t('notifications.badgeProfil') : null}
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

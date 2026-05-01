import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import React from 'react';
import { View } from 'react-native';

import { Colors } from '@/constants/DesignSystem';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      // @ts-ignore - Expo Router Tabs doesn't explicitly type sceneContainerStyle, but React Navigation accepts it
      sceneContainerStyle={{ backgroundColor: Colors.background.primary }}
      screenOptions={{
        tabBarActiveTintColor: Colors.primary[500],
        tabBarInactiveTintColor: Colors.neutral[400],
        headerShown: false,
        tabBarShowLabel: false,
        tabBarItemStyle: {
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        },
        tabBarStyle: {
          position: 'absolute',
          bottom: 0, // Reduced from 24 to 12 to push it lower
          left: 24,
          right: 24,
          backgroundColor: Colors.background.secondary,
          borderRadius: 24,
          height: 64,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 10,
          paddingBottom: 0, // centers icons vertically
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Trips',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              backgroundColor: focused ? `${Colors.primary[500]}25` : 'transparent',
            }}>
              <Ionicons name={focused ? "airplane" : "airplane-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Settings',
          tabBarIcon: ({ color, focused }) => (
            <View style={{
              width: 48,
              height: 48,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 24,
              backgroundColor: focused ? `${Colors.primary[500]}25` : 'transparent',
            }}>
              <Ionicons name={focused ? "settings" : "settings-outline"} size={24} color={color} />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

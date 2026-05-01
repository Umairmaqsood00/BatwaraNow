import { Tabs } from 'expo-router';
import React from 'react';
import { Image, Platform, Text } from 'react-native';

import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
  screenOptions={{
    tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
    headerShown: false,
    tabBarBackground: TabBarBackground,
    tabBarStyle: Platform.select({
      ios: {
        position: 'absolute',
      },
      default: {},
    }),
  }}
>
  <Tabs.Screen
    name="index"
    options={{
      title: 'Trips',
      tabBarIcon: ({ color }) => (
        <Image source={require('@/assets/images/plane.png')} style={{ width: 28, height: 28, tintColor: color }} />
      ),
      tabBarLabel: ({ color }) => (
        <Text style={{ color, fontSize: 14, paddingTop: 4 }}>Trips</Text>
      ),
    }}
  />
  <Tabs.Screen
    name="explore"
    options={{
      title: 'Settings',
      tabBarIcon: ({ color }) => (
        <Image source={require('@/assets/images/settingicon.png')} style={{ width: 28, height: 28, tintColor: color }} />
      ),
      tabBarLabel: ({ color }) => (
        <Text style={{ color, fontSize: 14, paddingTop: 4 }}>Settings</Text>
      ),
    }}
  />
</Tabs>

  );
}

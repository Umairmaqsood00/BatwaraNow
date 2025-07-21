import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, Text, View } from 'react-native';

import { IconSymbol } from '@/components/ui/IconSymbol';
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
        <IconSymbol size={28} name="airplane" color={color} />
      ),
      tabBarLabel: ({ color }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconSymbol size={16} name="airplane" color={color} />
          <Text style={{ color, fontSize: 14, marginLeft: 4 }}>Trips</Text>
        </View>
      ),
    }}
  />
  <Tabs.Screen
    name="explore"
    options={{
      title: 'Settings',
      tabBarIcon: ({ color }) => (
        <IconSymbol size={28} name="gear" color={color} />
      ),
      tabBarLabel: ({ color }) => (
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <IconSymbol size={16} name="gear" color={color} />
          <Text style={{ color, fontSize: 14, marginLeft: 4 }}>Settings</Text>
        </View>
      ),
    }}
  />
</Tabs>

  );
}

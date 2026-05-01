import { Colors, CommonStyles, Spacing, Typography } from '@/constants/DesignSystem';
import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { Drawer } from 'expo-router/drawer';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

function CustomDrawerContent(props: any) {
  return (
    <View style={styles.drawerContainer}>
      <View style={styles.drawerHeader}>
        <Text style={styles.drawerTitle}>
          Batwara<Text style={{ color: '#ffffff' }}>Now</Text>
        </Text>
        <Text style={styles.drawerSubtitle}>Split expenses with ease</Text>
      </View>
      <DrawerContentScrollView {...props} contentContainerStyle={{ paddingTop: 0 }}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>
    </View>
  );
}

export default function DrawerLayout() {
  return (
    <Drawer
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          backgroundColor: '#0c1324ff',
          width: 280,
        },
        drawerActiveTintColor: Colors.primary[500],
        drawerInactiveTintColor: Colors.text.secondary,
        drawerActiveBackgroundColor: `${Colors.primary[500]}15`,
        drawerLabelStyle: {
          fontSize: Typography.sizes.base,
          fontWeight: '600',
          marginLeft: -10,
        },
        sceneStyle: { backgroundColor: Colors.background.primary },
      }}
    >
      <Drawer.Screen
        name="index"
        options={{
          title: 'My Trips',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="airplane" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="explore"
        options={{
          title: 'Settings',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="settings" size={size} color={color} />
          ),
        }}
      />
      <Drawer.Screen
        name="about"
        options={{
          title: 'About',
          drawerIcon: ({ color, size }) => (
            <Ionicons name="information-circle" size={size} color={color} />
          ),
        }}
      />
    </Drawer>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    flex: 1,
    backgroundColor: '#0e1527ff',
  },
  drawerHeader: {
    paddingTop: 60,
    paddingBottom: Spacing.xl,
    paddingHorizontal: Spacing.lg,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
    marginBottom: Spacing.sm,
  },
  drawerTitle: {
    ...CommonStyles.textH1,
    fontSize: 28,
    color: Colors.primary[500],
    marginBottom: 4,
  },
  drawerSubtitle: {
    ...CommonStyles.textBody,
    color: Colors.text.secondary,
    fontSize: Typography.sizes.sm,
  },
});

import { Colors, CommonStyles, Spacing, Typography } from "@/constants/DesignSystem";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import { Ionicons } from '@expo/vector-icons';
import React from "react";
import { ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaView style={CommonStyles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity 
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          style={{ marginRight: 16, padding: 4 }}
        >
          <Ionicons name="menu" size={28} color="#ffffff" />
        </TouchableOpacity>
        <Text style={CommonStyles.textH1}>About</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <View style={CommonStyles.card}>
            <View style={styles.aboutHeader}>
              <Text style={CommonStyles.textH3}>BatwaraNow</Text>
              <Text style={CommonStyles.textCaption}>v1.0.0</Text>
            </View>
            <Text style={[CommonStyles.textLabel, { color: Colors.primary[500], marginBottom: Spacing.sm }]}>
              Developed by Umair
            </Text>
            <View style={styles.chipContainer}>
              <Text style={styles.techChip}>React Native</Text>
              <Text style={styles.techChip}>Node.js</Text>
              <Text style={styles.techChip}>Expo</Text>
            </View>
            <Text style={CommonStyles.textBody}>
              Focus on the memories, we will handle the math
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#070B14",
  },
  content: {
    flex: 1,
    paddingTop: Spacing.lg,
  },
  section: {
    marginBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
  },
  aboutHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  techChip: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    overflow: 'hidden',
  },
});

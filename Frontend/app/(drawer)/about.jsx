import { Ionicons } from "@expo/vector-icons";
import { DrawerActions, useNavigation } from "@react-navigation/native";
import React from "react";
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import {
  Colors,
  CommonStyles,
  Spacing,
  Typography,
} from "../../constants/DesignSystem";

export default function AboutScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={CommonStyles.container}
      edges={["right", "bottom", "left"]}
    >
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
          <View style={[CommonStyles.card, styles.primaryCard]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="information-circle-outline"
                  size={20}
                  color={Colors.primary[500]}
                  style={styles.sectionIcon}
                />
                <Text style={styles.sectionTitle}>About BatwaraNow</Text>
              </View>
            </View>
            <View style={styles.aboutHeader}>
              <Text style={CommonStyles.textH2}>BatwaraNow</Text>
              <Text style={CommonStyles.textCaption}>v1.0.0</Text>
            </View>
            <Text style={[CommonStyles.textBody, styles.descriptionText]}>
              BatwaraNow helps friends and groups split expenses easily during
              trips, events, and daily life.
            </Text>
            <Text style={[CommonStyles.textLabel, styles.taglineText]}>
              Focus on memories, we will handle the math.
            </Text>
            <View style={styles.chipContainer}>
              <Text style={styles.techChip}>React Native</Text>
              <Text style={styles.techChip}>Node.js</Text>
              <Text style={styles.techChip}>Expo</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <View style={[CommonStyles.card, styles.secondaryCard]}>
            <View style={styles.sectionHeader}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="person-circle-outline"
                  size={20}
                  color={Colors.text.secondary}
                  style={styles.sectionIcon}
                />
                <Text style={[styles.sectionTitle, styles.secondaryTitle]}>
                  About the Developer
                </Text>
              </View>
            </View>
            <Text style={styles.developerName}>Built by Umair</Text>
            <Text style={[CommonStyles.textBody, styles.developerDescription]}>
              I’m a computer science undergraduate and developer interested in
              cross platform mobile development and full-stack development. I
              enjoy building apps and websites that solve real-world problems
            </Text>
            <Text style={styles.developerDescription}>
              If you have feedback, suggestions, or encounter any issues, feel
              free to reach out:{" "}
            </Text>
            <Text style={styles.developerEmail}>
              {" "}
              umairmaqsood488@gmail.com
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
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
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.md,
  },
  primaryCard: {
    borderColor: "rgba(59,130,246,0.25)",
    backgroundColor: "rgba(59,130,246,0.08)",
  },
  secondaryCard: {
    marginTop: Spacing.xs,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  sectionIcon: {
    marginRight: Spacing.xs,
  },
  sectionTitle: {
    ...CommonStyles.textLabel,
    color: Colors.primary[500],
    fontWeight: "600",
  },
  secondaryTitle: {
    color: Colors.text.secondary,
  },
  aboutHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: Spacing.sm,
  },
  descriptionText: {
    color: Colors.text.secondary,
    marginBottom: Spacing.sm,
    textAlign: "justify",
  },
  taglineText: {
    color: Colors.text.primary,
    marginBottom: Spacing.md,
    fontWeight: "600",
  },
  chipContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: Spacing.xs,
  },
  techChip: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    backgroundColor: Colors.background.tertiary,
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: 12,
    overflow: "hidden",
  },
  developerName: {
    ...CommonStyles.textBody,
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
  developerDescription: {
    color: Colors.text.secondary,
    textAlign: "justify",
  },
  developerEmail: {
    color: Colors.primary[500],
    fontWeight: "600",
    marginBottom: Spacing.xs,
  },
});

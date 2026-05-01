import { Colors, CommonStyles, Spacing, Typography } from "@/constants/DesignSystem";
import { storage, type SettlementHistory } from "@/utils/storage";
import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from "react";
import {
  Alert,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

export default function SettingsScreen() {
  const [history, setHistory] = useState<SettlementHistory[]>([]);

  useEffect(() => {
    storage.getSettlementHistory().then(setHistory);
  }, []);

  const insets = useSafeAreaInsets();

  const handleClearHistory = () => {
    Alert.alert(
      "Clear History",
      "Are you sure you want to delete all settlement history? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Clear",
          style: "destructive",
          onPress: async () => {
            await storage.clearSettlementHistory();
            setHistory([]);
            Alert.alert("Success", "Settlement history has been cleared.");
          }
        }
      ]
    );
  };

  return (
    <SafeAreaView style={CommonStyles.container} edges={['right', 'bottom', 'left']}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <Text style={CommonStyles.textH1}>Settings</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>

        {/* About Section */}
        <View style={styles.section}>
          <Text style={CommonStyles.sectionTitle}>About</Text>
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

        {/* Settlement History Section */}
        <View style={styles.section}>
          <Text style={CommonStyles.sectionTitle}>Settlement History</Text>
          <View style={CommonStyles.card}>
            {history.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="receipt-outline" size={48} color={Colors.neutral[600]} style={{ marginBottom: Spacing.sm }} />
                <Text style={[CommonStyles.textBody, { color: Colors.text.secondary, textAlign: 'center' }]}>
                  No settlements to show yet. Time to plan a trip!
                </Text>
              </View>
            ) : (
              history
                .slice()
                .reverse()
                .map((entry, index) => (
                  <View key={entry.id} style={[styles.historyItem, index !== history.length - 1 && styles.borderBottom]}>
                    <Text style={[CommonStyles.textBody, { fontWeight: '600' }]}>
                      {entry.from} paid {entry.to} <Text style={{ color: Colors.success }}>Rs.{entry.amount.toFixed(2)}</Text>
                    </Text>
                    <Text style={CommonStyles.textCaption}>
                      {new Date(entry.settledAt).toLocaleDateString()} • {entry.tripName}
                    </Text>
                  </View>
                ))
            )}
          </View>
        </View>

        {/* Data Section */}
        <View style={styles.section}>
          <Text style={CommonStyles.sectionTitle}>Data</Text>
          <View style={CommonStyles.card}>
            <TouchableOpacity
              style={styles.destructiveButton}
              onPress={handleClearHistory}
            >
              <Ionicons name="trash-outline" size={20} color="#EF4444" style={{ marginRight: Spacing.sm }} />
              <Text style={[CommonStyles.textBody, { color: '#EF4444', fontWeight: '600' }]}>
                Clear Settlement History
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#070B14",
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: Spacing.lg,
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.lg,
  },
  historyItem: {
    paddingVertical: Spacing.md,
  },
  borderBottom: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.background.quaternary,
  },
  destructiveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.md,
    backgroundColor: '#EF444415',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#EF444430',
  }
});

import {
  BorderRadius,
  Colors,
  Icons,
  Spacing,
} from "@/constants/DesignSystem";
import React from "react";
import {
  FlatList,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

/**
 * @typedef {Object} Trip
 * @property {string} id
 * @property {string} name
 * @property {string[]} participants
 * @property {number} totalExpenses
 * @property {number} expenseCount
 */

/**
 * @typedef {Object} TripListScreenProps
 * @property {Trip[]} trips
 * @property {(tripId: string) => void} onTripPress
 * @property {() => void} onCreateNewTrip
 */

/** @param {TripListScreenProps} props */
export default function TripListScreen({ trips, onTripPress, onCreateNewTrip, onDeleteTrip }) {
  const insets = useSafeAreaInsets();
  const activeTripsLabel = `${trips.length} Active ${trips.length === 1 ? "Trip" : "Trips"
    }`;

  /** @param {{ item: Trip }} param0 */
  const renderTripItem = ({ item }) => (
    <TouchableOpacity
      style={styles.tripCardTouchable}
      onPress={() => onTripPress(item.id)}
      onLongPress={() => {
        Alert.alert(
          "Delete Trip",
          "Are you sure you want to delete this trip? All expenses and settlements will be permanently removed.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Delete",
              style: "destructive",
              onPress: () => onDeleteTrip && onDeleteTrip(item.id),
            },
          ]
        );
      }}
      activeOpacity={0.92}
    >
      <View style={styles.tripCard}>
        <View style={styles.rowBetween}>
          <Text style={styles.tripName} numberOfLines={1} ellipsizeMode="tail">
            {item.name}
          </Text>
          <Text style={styles.tripAmount} numberOfLines={1} ellipsizeMode="tail">
            Rs. {item.totalExpenses.toFixed(2)}
          </Text>
        </View>

        <View style={[styles.rowBetween, styles.metaRow]}>
          <Text style={styles.metaText}>
            {Icons.users} {item.participants.length} members
          </Text>
          <Text style={styles.metaText}>
            {Icons.expense} {item.expenseCount} expenses
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <View style={styles.membersPill}>
            <Text style={styles.membersPillText}>
              {item.participants.length} total members
            </Text>
          </View>
          <Text style={styles.detailsLink}>View details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#070B14" />
      <View style={[styles.header, { paddingTop: insets.top - 15 }]}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerTextWrap}>
            <Text style={styles.headerTitle}>My Trips</Text>
            <Text style={styles.headerSubtitle}>
              Track shared expenses across your trips
            </Text>
          </View>
          <TouchableOpacity
            style={styles.newTripButton}
            onPress={onCreateNewTrip}
            activeOpacity={0.9}
          >
            <Text style={styles.newTripButtonText}>+ New Trip</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.activeTripsPill}>
          <Text style={styles.activeTripsPillText}>{activeTripsLabel}</Text>
        </View>
      </View>

      <View style={styles.content}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first trip to start splitting expenses with your group.
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={onCreateNewTrip}
              activeOpacity={0.9}
            >
              <Text style={styles.emptyButtonText}>Create First Trip</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <FlatList
            data={trips}
            renderItem={renderTripItem}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.listContainer}
            showsVerticalScrollIndicator={false}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        )}
      </View>
    </SafeAreaView>
  );
}

const ACCENT = "#3B82F6";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B14",
  },
  header: {
    paddingHorizontal: Spacing.md,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.05)",
    backgroundColor: "#070B14",
  },
  headerTopRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: Spacing.md,
  },
  headerTextWrap: {
    flex: 1,
    minWidth: 0,
    paddingRight: Spacing.sm,
  },
  headerTitle: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    letterSpacing: -0.2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#5F6878",
    lineHeight: 20,
  },
  newTripButton: {
    height: 40,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(79,124,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },
  newTripButtonText: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: "600",
  },
  activeTripsPill: {
    marginTop: Spacing.md,
    alignSelf: "flex-start",
    height: 32,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.03)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    alignItems: "center",
    justifyContent: "center",
  },
  activeTripsPillText: {
    fontSize: 14,
    color: "#8792A2",
    fontWeight: "500",
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.md,
  },
  listContainer: {
    paddingTop: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  separator: {
    height: 14,
  },
  tripCardTouchable: {
    borderRadius: BorderRadius.xl,
  },
  tripCard: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.03)",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.22,
    shadowRadius: 10,
    elevation: 4,
  },
  rowBetween: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  tripName: {
    flex: 1,
    marginRight: Spacing.md,
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    letterSpacing: -0.2,
  },
  tripAmount: {
    fontSize: 18,
    fontWeight: "600",
    color: ACCENT,
  },
  metaRow: {
    marginTop: Spacing.sm,
  },
  metaText: {
    fontSize: 14,
    color: "#5F6878",
  },
  detailsRow: {
    marginTop: Spacing.md,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  membersPill: {
    height: 30,
    paddingHorizontal: Spacing.md,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(255,255,255,0.04)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  membersPillText: {
    color: "#8792A2",
    fontSize: 12,
    fontWeight: "500",
  },
  detailsLink: {
    color: ACCENT,
    fontSize: 14,
    fontWeight: "600",
  },
  emptyState: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: Spacing.lg,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#5F6878",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  emptyButton: {
    height: 44,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.full,
    backgroundColor: "rgba(79,124,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyButtonText: {
    color: ACCENT,
    fontSize: 16,
    fontWeight: "600",
  },
});

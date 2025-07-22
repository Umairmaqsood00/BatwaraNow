import {
  BorderRadius,
  Colors,
  Icons,
  Shadows,
  Spacing,
  Typography,
} from "@/constants/DesignSystem";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

type Trip = {
  id: string;
  name: string;
  participants: string[];
  totalExpenses: number;
  expenseCount: number;
};

type TripListScreenProps = {
  trips: Trip[];
  onTripPress: (tripId: string) => void;
  onCreateNewTrip: () => void;
  onDeleteTrip?: (tripId: string) => void;
  onClearAllData?: () => void;
  onRefreshData?: () => void;
};

export default function TripListScreen({
  trips,
  onTripPress,
  onCreateNewTrip,
  onDeleteTrip,
  onClearAllData,
  onRefreshData,
}: TripListScreenProps) {
  const renderTripItem = ({ item }: { item: Trip }) => (
    <View style={styles.tripCard}>
      <TouchableOpacity
        style={styles.tripCardContent}
        onPress={() => onTripPress(item.id)}
        activeOpacity={0.9}
      >
        <LinearGradient
          colors={[Colors.background.secondary, Colors.background.tertiary]}
          style={styles.cardGradient}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.tripHeader}>
            <View style={styles.tripInfo}>
              <Text style={styles.tripIcon}>{Icons.trip}</Text>
              <View style={styles.tripDetails}>
                <Text
                  style={styles.tripName}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.name}
                </Text>
                <Text
                  style={styles.tripSubtitle}
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.participants.length} members • {item.expenseCount}{" "}
                  expenses
                </Text>
              </View>
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.amountLabel}>Total</Text>
              <Text
                style={styles.amountValue}
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                Rs.{item.totalExpenses.toFixed(2)}
              </Text>
            </View>
            {onDeleteTrip && (
              <TouchableOpacity
                style={styles.deleteTripButton}
                onPress={() => {
                  Alert.alert(
                    "Delete Trip",
                    `Are you sure you want to delete "${item.name}"? This will also delete all associated expenses.`,
                    [
                      { text: "Cancel", style: "cancel" },
                      {
                        text: "Delete",
                        style: "destructive",
                        onPress: () => onDeleteTrip(item.id),
                      },
                    ]
                  );
                }}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <Text style={styles.deleteTripIcon}>{Icons.delete}</Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.tripFooter}>
            <View style={styles.participantsPreview}>
              {item.participants.slice(0, 3).map((participant, index) => (
                <View
                  key={index}
                  style={[styles.participantAvatar, { zIndex: 3 - index }]}
                >
                  <Text style={styles.participantInitial}>
                    {participant.charAt(0).toUpperCase()}
                  </Text>
                </View>
              ))}
              {item.participants.length > 3 && (
                <View style={styles.moreParticipants}>
                  <Text style={styles.moreParticipantsText}>
                    +{item.participants.length - 3}
                  </Text>
                </View>
              )}
            </View>
            <View style={styles.tripStats}>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>{Icons.money}</Text>
                <Text style={styles.statValue}>{item.expenseCount}</Text>
              </View>
              <View style={styles.statItem}>
                <Text style={styles.statIcon}>{Icons.users}</Text>
                <Text style={styles.statValue}>{item.participants.length}</Text>
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={Colors.background.primary}
      />

      <LinearGradient
        colors={[Colors.background.secondary, Colors.background.primary]}
        style={styles.header}
      >
        <View style={styles.headerContent}>
          <View>
            <Text style={styles.headerTitle}>My Trips</Text>
            <Text style={styles.headerSubtitle}>
              {trips.length} {trips.length === 1 ? "trip" : "trips"} • Manage
              expenses together
            </Text>
          </View>
          <View style={styles.headerActions}>
            <View style={styles.headerStats}>
              <Text style={styles.totalTrips}>{trips.length}</Text>
              <Text style={styles.totalTripsLabel}>Trips</Text>
            </View>
            {onClearAllData && (
              <TouchableOpacity
                style={styles.settingsButton}
                onPress={() => {
                  Alert.alert("Settings", "Choose an option:", [
                    { text: "Cancel", style: "cancel" },
                    {
                      text: "Refresh Data",
                      style: "default",
                      onPress: onRefreshData,
                    },
                    {
                      text: "Clear All Data",
                      style: "destructive",
                      onPress: onClearAllData,
                    },
                  ]);
                }}
              >
                <Text style={styles.settingsIcon}>{Icons.settings}</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {trips.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconContainer}>
              <Text style={styles.emptyIcon}>{Icons.trip}</Text>
            </View>
            <Text style={styles.emptyTitle}>No trips yet</Text>
            <Text style={styles.emptySubtitle}>
              Create your first trip to start splitting expenses with friends
              and family
            </Text>
            <TouchableOpacity
              style={styles.emptyButton}
              onPress={onCreateNewTrip}
            >
              <Text style={styles.emptyButtonText}>Create Your First Trip</Text>
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

      {trips.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={onCreateNewTrip}
          activeOpacity={0.8}
        >
          <View style={styles.fabContainer}>
            <Text style={styles.fabIcon}>{Icons.add}</Text>
          </View>
        </TouchableOpacity>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  } as ViewStyle,
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    ...Shadows.md,
  } as ViewStyle,
  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  headerTitle: {
    fontSize: Typography.sizes["3xl"],
    fontWeight: "700" as const,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  headerSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  } as TextStyle,
  headerActions: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  headerStats: {
    alignItems: "center",
  } as ViewStyle,
  totalTrips: {
    fontSize: Typography.sizes["2xl"],
    fontWeight: "700" as const,
    color: Colors.primary[500],
  } as TextStyle,
  totalTripsLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
  } as TextStyle,
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[200],
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  } as ViewStyle,
  settingsIcon: {
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
  } as TextStyle,
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  } as ViewStyle,
  listContainer: {
    paddingVertical: Spacing.lg,
  } as ViewStyle,
  separator: {
    height: Spacing.md,
  } as ViewStyle,
  tripCard: {
    borderRadius: BorderRadius.xl,
    ...Shadows.lg,
    minWidth: 320,
    maxWidth: 500,
    alignSelf: "center",
  } as ViewStyle,
  tripCardContent: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    minWidth: 320,
    maxWidth: 500,
    alignSelf: "center",
  } as ViewStyle,
  cardGradient: {
    borderRadius: BorderRadius.xl,
    padding: Spacing.lg,
    minWidth: 320,
    maxWidth: 500,
    alignSelf: "center",
  } as ViewStyle,
  tripHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: Spacing.lg,
  } as ViewStyle,
  tripInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    minWidth: 0,
  } as ViewStyle,
  tripIcon: {
    fontSize: Typography.sizes["2xl"],
    marginRight: Spacing.md,
  } as TextStyle,
  tripDetails: {
    flex: 1,
    minWidth: 0,
  } as ViewStyle,
  tripName: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    flexShrink: 1,
    flexWrap: "wrap",
    minWidth: 0,
  } as TextStyle,
  tripSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    flexShrink: 1,
    flexWrap: "wrap",
    minWidth: 0,
  } as TextStyle,
  tripHeaderActions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  amountContainer: {
    alignItems: "flex-end",
    minWidth: 0,
    flexShrink: 1,
    flexWrap: "wrap",
  } as ViewStyle,
  amountLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  } as TextStyle,
  amountValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700" as const,
    color: Colors.secondary[500],
    minWidth: 0,
    flexShrink: 1,
    flexWrap: "wrap",
  } as TextStyle,
  deleteTripButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.error + "20",
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
    borderWidth: 2,
    borderColor: Colors.error,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  deleteTripIcon: {
    fontSize: Typography.sizes.base,
    color: Colors.error,
  } as TextStyle,
  tripFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  } as ViewStyle,
  participantsPreview: {
    flexDirection: "row",
    alignItems: "center",
  } as ViewStyle,
  participantAvatar: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[500],
    alignItems: "center",
    justifyContent: "center",
    marginRight: -8,
    borderWidth: 2,
    borderColor: Colors.background.secondary,
  } as ViewStyle,
  participantInitial: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600" as const,
    color: Colors.text.inverse,
  } as TextStyle,
  moreParticipants: {
    width: 32,
    height: 32,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.neutral[300],
    alignItems: "center",
    justifyContent: "center",
    marginLeft: Spacing.sm,
  } as ViewStyle,
  moreParticipantsText: {
    fontSize: Typography.sizes.xs,
    fontWeight: "500" as const,
    color: Colors.text.secondary,
  } as TextStyle,
  tripStats: {
    flexDirection: "row",
  } as ViewStyle,
  statItem: {
    alignItems: "center",
  } as ViewStyle,
  statIcon: {
    fontSize: Typography.sizes.sm,
    marginBottom: Spacing.xs,
  } as TextStyle,
  statValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: "600" as const,
    color: Colors.text.primary,
  } as TextStyle,
  deleteButton: {
    backgroundColor: Colors.error,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    alignItems: "center",
    justifyContent: "center",
    marginTop: Spacing.sm,
    ...Shadows.md,
  } as ViewStyle,
  deleteButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: "600" as const,
    color: Colors.text.inverse,
  } as TextStyle,
  fab: {
    position: "absolute",
    bottom: Spacing.xl,
    right: Spacing.xl,
    width: 56,
    height: 56,
    borderRadius: BorderRadius.full,
    ...Shadows.xl,
  } as ViewStyle,

  fabContainer: {
    width: "100%",
    height: "100%",
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 2,
    borderColor: Colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
  } as ViewStyle,

  fabIcon: {
    fontSize: Typography.sizes.xl,
    color: Colors.text.primary,
  } as TextStyle,

  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: Spacing.xl,
  } as ViewStyle,

  emptyIconContainer: {
    width: 80,
    height: 80,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.lg,
  } as ViewStyle,

  emptyIcon: {
    fontSize: Typography.sizes["3xl"],
  } as TextStyle,

  emptyTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: "600" as const,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
    textAlign: "center",
  } as TextStyle,

  emptySubtitle: {
    fontSize: Typography.sizes.base,
    color: Colors.text.secondary,
    textAlign: "center",
    lineHeight: Typography.sizes.base * 1.5,
    marginBottom: Spacing.xl,
  } as TextStyle,

  emptyButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.xl,
    borderRadius: BorderRadius.md,
    ...Shadows.md,
  } as ViewStyle,

  emptyButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: "600" as const,
    color: Colors.text.inverse,
  } as TextStyle,
});

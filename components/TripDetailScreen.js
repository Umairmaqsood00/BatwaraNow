import { Icons } from "@/constants/DesignSystem";
import { BlurView } from "expo-blur";
import React, { memo } from "react";
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

function getPayers(expense) {
  if (Array.isArray(expense.paidBy)) return expense.paidBy;
  if (typeof expense.paidBy === "string")
    return [{ name: expense.paidBy, amount: expense.amount }];
  return [];
}

// ─── Reusable Components ──────────────────────────────────────────────────────

const Card = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

const SectionHeader = ({ title }) => (
  <Text style={styles.sectionTitle}>{title}</Text>
);

const EmptyState = ({ icon, title, subtitle, actionLabel, onAction }) => (
  <View style={styles.emptyStateContainer}>
    <View style={styles.emptyStateIconContainer}>
      <Text style={styles.emptyStateIcon}>{icon}</Text>
    </View>
    <Text style={styles.emptyStateTitle}>{title}</Text>
    <Text style={styles.emptyStateSubtitle}>{subtitle}</Text>
    {actionLabel && onAction && (
      <Pressable
        style={({ pressed }) => [
          styles.primaryButton,
          pressed && styles.pressedScale,
          { marginTop: 16 },
        ]}
        onPress={onAction}
      >
        <Text style={styles.primaryButtonText}>{actionLabel}</Text>
      </Pressable>
    )}
  </View>
);

const ExpenseItem = memo(({ item }) => {
  const payers = getPayers(item);
  return (
    <Card style={styles.expenseCard}>
      <View style={styles.expenseHeader}>
        <View style={styles.expenseIconContainer}>
          <Text style={styles.expenseIcon}>{Icons.expense}</Text>
        </View>
        <View style={styles.expenseDetails}>
          <Text style={styles.expenseDescription} numberOfLines={1}>
            {item.description}
          </Text>
          <Text style={styles.expenseDate}>{item.date}</Text>
        </View>
        <Text style={styles.expenseAmount}>Rs.{item.amount.toFixed(2)}</Text>
      </View>

      <View style={styles.expenseDivider} />

      <View style={styles.expenseFooter}>
        <View style={styles.expenseMeta}>
          <Text style={styles.metaLabel}>Paid by</Text>
          {payers.map((payer, idx) => (
            <Text style={styles.metaValue} key={idx} numberOfLines={1}>
              {payer.name} (Rs.{payer.amount.toFixed(2)})
            </Text>
          ))}
        </View>
        <View style={styles.expenseMetaRight}>
          <Text style={styles.metaLabel}>Split between</Text>
          <Text style={styles.metaValue}>{item.splitBetween.length} people</Text>
        </View>
      </View>
    </Card>
  );
});

const BalanceItem = memo(({ balance, onSettleBalance }) => {
  return (
    <Card style={styles.balanceCard}>
      <View style={styles.balanceContent}>
        <View style={styles.balanceIconContainer}>
          <Text style={styles.balanceIcon}>{Icons.balance}</Text>
        </View>
        <View style={styles.balanceInfo}>
          <Text style={styles.balanceText} numberOfLines={1}>
            <Text style={styles.balanceFrom}>{balance.from}</Text>
            <Text style={styles.balanceArrow}> owes </Text>
            <Text style={styles.balanceTo}>{balance.to}</Text>
          </Text>
          <Text style={styles.balanceAmount}>
            Rs.{balance.amount.toFixed(2)}
          </Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.settleButton,
            pressed && styles.pressedScale,
          ]}
          onPress={() => {
            Alert.alert(
              "Mark as Paid",
              `Mark that ${balance.from} has paid ${balance.to} Rs.${balance.amount.toFixed(2)}?`,
              [
                { text: "Cancel", style: "cancel" },
                {
                  text: "Mark as Paid",
                  style: "default",
                  onPress: () => onSettleBalance?.(balance.from, balance.to),
                },
              ]
            );
          }}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.settleIcon}>{Icons.check}</Text>
        </Pressable>
      </View>
    </Card>
  );
});

const ScreenHeader = memo(({ trip, expensesCount, onBack, onAddExpense }) => {
  const insets = useSafeAreaInsets();
  return (
    <BlurView
      intensity={24}
      tint="dark"
      style={[styles.headerBlur, { paddingTop: insets.top - 25 }]}
    >
      <View style={styles.headerContent}>
        <Pressable
          onPress={onBack}
          style={({ pressed }) => [
            styles.iconButton,
            pressed && styles.pressedScale,
          ]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.iconButtonText}>{Icons.back}</Text>
        </Pressable>
        <View style={styles.headerTextWrap}>
          <Text style={styles.headerTitle} numberOfLines={1}>
            {trip.name}
          </Text>
          <Text style={styles.headerSubtitle}>
            {trip.participants.length} members • {expensesCount} expenses
          </Text>
        </View>
        <Pressable
          onPress={onAddExpense}
          style={({ pressed }) => [
            styles.actionButton,
            pressed && styles.pressedScale,
          ]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.actionButtonText}>+ Add Expense</Text>
        </Pressable>
      </View>
    </BlurView>
  );
});

// ─── Main Screen Component ─────────────────────────────────────────────────────

export default function TripDetailScreen({
  trip,
  expenses,
  balances,
  summary,
  onAddExpense,
  onBack,
  onDeleteExpense,
  onUpdateExpense,
  onSettleBalance,
  onUpdateTrip,
}) {
  const totalExpenses = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#05080F" />

      <ScreenHeader
        trip={trip}
        expensesCount={expenses.length}
        onBack={onBack}
        onAddExpense={onAddExpense}
      />

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Cards */}
        <View style={styles.summaryRow}>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconWrapper}>
              <Text style={styles.summaryIcon}>{Icons.money}</Text>
            </View>
            <View style={styles.summaryTextWrapper}>
              <Text style={styles.summaryLabel}>Total Expenses</Text>
              <Text
                style={styles.summaryValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                Rs.{totalExpenses.toFixed(2)}
              </Text>
            </View>
          </Card>
          <Card style={styles.summaryCard}>
            <View style={styles.summaryIconWrapper}>
              <Text style={styles.summaryIcon}>{Icons.users}</Text>
            </View>
            <View style={styles.summaryTextWrapper}>
              <Text style={styles.summaryLabel}>Members</Text>
              <Text
                style={styles.summaryValue}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.5}
              >
                {trip.participants.length}
              </Text>
            </View>
          </Card>
        </View>

        {/* Balance Summary */}
        <View style={styles.section}>
          <SectionHeader title="Balance Summary" />
          {balances.length === 0 ? (
            <EmptyState
              icon={Icons.check}
              title="All settled up!"
              subtitle="No outstanding balances between participants"
            />
          ) : (
            <View style={styles.listContainer}>
              {balances.map((balance, index) => (
                <BalanceItem
                  key={index}
                  balance={balance}
                  onSettleBalance={onSettleBalance}
                />
              ))}
            </View>
          )}
        </View>

        {/* Recent Expenses */}
        <View style={styles.section}>
          <SectionHeader title="Recent Expenses" />
          {expenses.length === 0 ? (
            <EmptyState
              icon={Icons.expense}
              title="No expenses yet"
              subtitle="Add your first expense to get started tracking"
              actionLabel="Add First Expense"
              onAction={onAddExpense}
            />
          ) : (
            <View style={styles.listContainer}>
              {expenses.map((item) => (
                <ExpenseItem key={item.id} item={item} />
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070B14",
  },

  headerBlur: {
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.06)",
    backgroundColor: "rgba(255,255,255,0.02)",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: "rgba(255,255,255,0.07)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonText: {
    fontSize: 16,
    color: "#E5E7EB",
  },
  actionButton: {
    height: 36,
    paddingHorizontal: 16,
    borderRadius: 999,
    backgroundColor: "rgba(79,124,255,0.12)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.24)",
    alignItems: "center",
    justifyContent: "center",
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: "600",
    color: "#3B82F6",
  },
  headerTextWrap: {
    flex: 1,
    paddingHorizontal: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  // ── Layout ──
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 16,
  },
  listContainer: {
    gap: 12,
  },
  // ── Reusable Card ──
  card: {
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    padding: 16,
  },
  // ── Summary Row ──
  summaryRow: {
    flexDirection: "row",
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
  },
  summaryIconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(79,124,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  summaryIcon: {
    fontSize: 18,
    color: "#4F7CFF",
  },
  summaryTextWrapper: {
    flex: 1,
  },
  summaryLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  summaryValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  // ── Empty State ──
  emptyStateContainer: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 32,
    paddingHorizontal: 16,
    backgroundColor: "rgba(255,255,255,0.02)",
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    borderStyle: "dashed",
  },
  emptyStateIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  emptyStateIcon: {
    fontSize: 24,
    color: "#6B7280",
  },
  emptyStateTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 8,
  },
  emptyStateSubtitle: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    maxWidth: "80%",
  },
  // ── Primary Button ──
  primaryButton: {
    height: 44,
    paddingHorizontal: 20,
    borderRadius: 999,
    backgroundColor: "rgba(79,124,255,0.15)",
    borderWidth: 1,
    borderColor: "rgba(79,124,255,0.30)",
    alignItems: "center",
    justifyContent: "center",
  },
  primaryButtonText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4F7CFF",
  },
  // ── Expense Item ──
  expenseCard: {
    padding: 16,
  },
  expenseHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  expenseIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  expenseIcon: {
    fontSize: 20,
    color: "#E5E7EB",
  },
  expenseDetails: {
    flex: 1,
    marginRight: 12,
  },
  expenseDescription: {
    fontSize: 16,
    fontWeight: "600",
    color: "#E5E7EB",
    marginBottom: 4,
  },
  expenseDate: {
    fontSize: 13,
    color: "#6B7280",
  },
  expenseAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  expenseDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.06)",
    marginVertical: 16,
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseMeta: {
    flex: 1,
    alignItems: "flex-start",
  },
  expenseMetaRight: {
    alignItems: "flex-end",
  },
  metaLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: "500",
    color: "#E5E7EB",
  },
  // ── Balance Item ──
  balanceCard: {
    padding: 16,
  },
  balanceContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  balanceIconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "rgba(255,255,255,0.04)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  balanceIcon: {
    fontSize: 18,
    color: "#E5E7EB",
  },
  balanceInfo: {
    flex: 1,
    marginRight: 12,
  },
  balanceText: {
    fontSize: 14,
    color: "#E5E7EB",
    marginBottom: 4,
  },
  balanceFrom: {
    fontWeight: "600",
    color: "#FF6B6B",
  },
  balanceArrow: {
    color: "#6B7280",
  },
  balanceTo: {
    fontWeight: "600",
    color: "#51CF66",
  },
  balanceAmount: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E5E7EB",
  },
  settleButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(81, 207, 102, 0.15)",
    borderWidth: 1,
    borderColor: "rgba(81, 207, 102, 0.3)",
    alignItems: "center",
    justifyContent: "center",
  },
  settleIcon: {
    fontSize: 16,
    color: "#51CF66",
  },
  // ── Utilities ──
  pressedScale: {
    transform: [{ scale: 0.96 }],
  },
});

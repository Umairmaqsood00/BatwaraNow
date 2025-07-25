import {
  BorderRadius,
  Colors,
  Icons,
  Spacing,
  Typography,
} from "@/constants/DesignSystem";
import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

function getPayers(expense) {
  if (Array.isArray(expense.paidBy)) return expense.paidBy;
  if (typeof expense.paidBy === "string")
    return [{ name: expense.paidBy, amount: expense.amount }];
  return [];
}

const renderExpenseItem = ({ item }) => (
  <View style={styles.expenseCard}>
    <LinearGradient
      colors={[Colors.background.secondary, Colors.background.tertiary]}
      style={styles.expenseGradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <View style={styles.expenseHeader}>
        <View style={styles.expenseInfo}>
          <Text style={styles.expenseIcon}>{Icons.expense}</Text>
          <View style={styles.expenseDetails}>
            <Text style={styles.expenseDescription}>{item.description}</Text>
            <Text style={styles.expenseDate}>{item.date}</Text>
          </View>
        </View>
        <Text style={styles.expenseAmount}>Rs.{item.amount.toFixed(2)}</Text>
      </View>

      <View style={styles.expenseFooter}>
        <View style={styles.expenseMeta}>
          <Text style={styles.paidByLabel}>Paid by</Text>
          {getPayers(item).map((payer, idx) => (
            <Text style={styles.paidByValue} key={idx}>
              {payer.name} (Rs.{payer.amount.toFixed(2)})
            </Text>
          ))}
        </View>
        <View style={styles.expenseMeta}>
          <Text style={styles.splitLabel}>Split between</Text>
          <Text style={styles.splitValue}>
            {item.splitBetween.length} people
          </Text>
        </View>
      </View>
    </LinearGradient>
  </View>
);

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

  const renderBalanceItem = (
    balance,
    index
  ) => (
    <View key={index} style={styles.balanceCard}>
      <LinearGradient
        colors={[Colors.background.secondary, Colors.background.tertiary]}
        style={styles.balanceGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.balanceContent}>
          <View style={styles.balanceLeftSection}>
            <View style={styles.balanceIconContainer}>
              <Text style={styles.balanceIcon}>{Icons.balance}</Text>
            </View>
            <View style={styles.balanceInfo}>
              <Text style={styles.balanceText}>
                <Text style={styles.balanceFrom}>{balance.from}</Text>
                <Text style={styles.balanceArrow}> owes </Text>
                <Text style={styles.balanceTo}>{balance.to}</Text>
              </Text>
              <Text style={styles.balanceAmount}>
                Rs.{balance.amount.toFixed(2)}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.balanceSettleButton}
            onPress={() => {
              console.log("=== SETTLE BUTTON PRESSED ===");
              console.log(
                "From:",
                balance.from,
                "To:",
                balance.to,
                "Amount:",
                balance.amount
              );
              Alert.alert(
                "Mark as Paid",
                `Mark that ${balance.from} has paid ${
                  balance.to
                } Rs.${balance.amount.toFixed(2)}?`,
                [
                  { text: "Cancel", style: "cancel" },
                  {
                    text: "Mark as Paid",
                    style: "default",
                    onPress: () => {
                      console.log("=== CONFIRMED SETTLEMENT ===");
                      onSettleBalance?.(balance.from, balance.to);
                    },
                  },
                ]
              );
            }}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Text style={styles.balanceSettleIcon}>{Icons.check}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>
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
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Text style={styles.backIcon}>{Icons.back}</Text>
          </TouchableOpacity>
          <View style={styles.headerInfo}>
            <Text style={styles.tripTitle}>{trip.name}</Text>
            <Text style={styles.tripSubtitle}>
              {trip.participants.length} members • {expenses.length} expenses
            </Text>
          </View>
          <TouchableOpacity style={styles.addButton} onPress={onAddExpense}>
            <Text style={styles.addIcon}>{Icons.add}</Text>
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[Colors.background.secondary, Colors.background.tertiary]}
                style={styles.summaryGradient}
              >
                <Text style={styles.summaryIcon}>{Icons.money}</Text>
                <Text style={styles.summaryValue}>
                  Rs.{totalExpenses.toFixed(2)}
                </Text>
                <Text style={styles.summaryLabel}>Total Expenses</Text>
              </LinearGradient>
            </View>
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[Colors.background.secondary, Colors.background.tertiary]}
                style={styles.summaryGradient}
              >
                <Text style={styles.summaryIcon}>{Icons.users}</Text>
                <Text style={styles.summaryValue}>
                  {trip.participants.length}
                </Text>
                <Text style={styles.summaryLabel}>Members</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Balance Summary</Text>
          {balances.length === 0 ? (
            <View style={styles.emptyBalance}>
              <View style={styles.emptyBalanceIcon}>
                <Text style={styles.emptyBalanceIconText}>{Icons.check}</Text>
              </View>
              <Text style={styles.emptyBalanceTitle}>All settled up!</Text>
              <Text style={styles.emptyBalanceSubtitle}>
                No outstanding balances between participants
              </Text>
            </View>
          ) : (
            <View style={styles.balancesList}>
              {balances.map((balance, index) =>
                renderBalanceItem(balance, index)
              )}
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.length === 0 ? (
            <View style={styles.emptyExpenses}>
              <View style={styles.emptyExpensesIcon}>
                <Text style={styles.emptyExpensesIconText}>
                  {Icons.expense}
                </Text>
              </View>
              <Text style={styles.emptyExpensesTitle}>No expenses yet</Text>
              <Text style={styles.emptyExpensesSubtitle}>
                Add your first expense to get started
              </Text>
              <TouchableOpacity
                style={styles.emptyExpensesButton}
                onPress={onAddExpense}
              >
                <Text style={styles.emptyExpensesButtonText}>
                  Add First Expense
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={expenses}
              renderItem={renderExpenseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => (
                <View style={styles.expenseSeparator} />
              )}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  backIcon: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  },
  headerInfo: {
    flex: 1,
  },
  tripTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    flexShrink: 1,
    flexWrap: "wrap",
    minWidth: 0,
  },
  tripSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    flexShrink: 1,
    flexWrap: "wrap",
    minWidth: 0,
  },
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.text.primary,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  },
  addIcon: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  },
  summarySection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryRow: {
    flexDirection: "row",
    gap: Spacing.md,
  },
  summaryCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    minWidth: 0,
    maxWidth: 220,
  },
  summaryGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: "center",
    minWidth: 0,
    maxWidth: 220,
  },
  summaryIcon: {
    fontSize: Typography.sizes.xl,
    marginBottom: Spacing.sm,
  },
  summaryValue: {
    fontSize: Typography.sizes.base,
    fontWeight: "700",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
    flexShrink: 1,
    flexWrap: "wrap",
    minWidth: 0,
  },
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.primary,
    textAlign: "center",
  },
  section: {
    marginBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  },
  emptyBalance: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyBalanceIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success + "20",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  emptyBalanceIconText: {
    fontSize: Typography.sizes.xl,
    color: Colors.success,
  },
  emptyBalanceTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyBalanceSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: "center",
  },
  balancesList: {
    gap: Spacing.md,
  },

  balanceCard: {
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  balanceGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  balanceContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  balanceLeftSection: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary[500],
    alignItems: "center",
    justifyContent: "center",
    marginRight: Spacing.md,
  },
  balanceIcon: {
    fontSize: Typography.sizes.lg,
  },
  balanceInfo: {
    flex: 1,
  },
  balanceText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  balanceFrom: {
    fontWeight: "600",
    color: Colors.error,
  },
  balanceArrow: {
    color: Colors.text.secondary,
  },
  balanceTo: {
    fontWeight: "600",
    color: Colors.success,
  },
  balanceAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text.primary,
  },

  emptyExpenses: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emptyExpensesIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    alignItems: "center",
    justifyContent: "center",
    marginBottom: Spacing.md,
  },
  emptyExpensesIconText: {
    fontSize: Typography.sizes.xl,
  },
  emptyExpensesTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  },
  emptyExpensesSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: "center",
    marginBottom: Spacing.lg,
  },
  emptyExpensesButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  emptyExpensesButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.text.inverse,
  },
  expenseSeparator: {
    height: Spacing.md,
  },
  expenseCard: {
    borderRadius: BorderRadius.lg,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  expenseGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  },
  expenseHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: Spacing.md,
  },
  expenseInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  expenseIcon: {
    fontSize: Typography.sizes.xl,
    marginRight: Spacing.md,
  },
  expenseDetails: {
    flex: 1,
  },
  expenseDescription: {
    fontSize: Typography.sizes.base,
    fontWeight: "600",
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  },
  expenseDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  },
  expenseAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: "700",
    color: Colors.text.primary,
  },
  expenseFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  expenseMeta: {
    alignItems: "flex-start",
  },
  paidByLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  paidByValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  splitLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  },
  splitValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: "500",
    color: Colors.text.primary,
  },
  balanceSettleButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success + "20",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  balanceSettleIcon: {
    fontSize: Typography.sizes.xl,
    color: Colors.success,
  },
});

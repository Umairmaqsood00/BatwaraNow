import { BorderRadius, Colors, Icons, Spacing, Typography } from '@/constants/DesignSystem';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import {
  Alert,
  FlatList,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';

type Expense = {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
};

type TripDetailScreenProps = {
  trip: {
    id: string;
    name: string;
    participants: string[];
  };
  expenses: Expense[];
  balances: Array<{
    from: string;
    to: string;
    amount: number;
    isSettled: boolean;
    settledAt?: string;
  }>;
  summary?: {
    totalExpenses: number;
    expenseCount: number;
    participantCount: number;
    averagePerExpense: number;
  };
  onAddExpense: () => void;
  onBack: () => void;
  onDeleteExpense?: (expenseId: string) => void;
  onUpdateExpense?: (expenseId: string, data: any) => void;
  onSettleBalance?: (from: string, to: string) => void;
  onUpdateTrip?: (tripId: string, data: any) => void;
};

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
}: TripDetailScreenProps) {
  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  const renderExpenseItem = ({ item }: { item: Expense }) => (
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
          <Text style={styles.expenseAmount}>₹{item.amount.toFixed(2)}</Text>
        </View>
        
        <View style={styles.expenseFooter}>
          <View style={styles.expenseMeta}>
            <Text style={styles.paidByLabel}>Paid by</Text>
            <Text style={styles.paidByValue}>{item.paidBy}</Text>
          </View>
          <View style={styles.expenseMeta}>
            <Text style={styles.splitLabel}>Split between</Text>
            <Text style={styles.splitValue}>{item.splitBetween.length} people</Text>
          </View>
        </View>
      </LinearGradient>
    </View>
  );

  const renderBalanceItem = (balance: { from: string; to: string; amount: number }, index: number) => (
    <View key={index} style={styles.balanceCard}>
      <LinearGradient
        colors={[Colors.secondary[50], Colors.secondary[100]]}
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
              <Text style={styles.balanceAmount}>₹{balance.amount.toFixed(2)}</Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.balanceSettleButton}
            onPress={() => {
              console.log('=== SETTLE BUTTON PRESSED ===');
              console.log('From:', balance.from, 'To:', balance.to, 'Amount:', balance.amount);
              Alert.alert(
                'Mark as Paid',
                `Mark that ${balance.from} has paid ${balance.to} ₹${balance.amount.toFixed(2)}?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Mark as Paid', 
                    style: 'default',
                    onPress: () => {
                      console.log('=== CONFIRMED SETTLEMENT ===');
                      onSettleBalance?.(balance.from, balance.to);
                    }
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
      <StatusBar barStyle="dark-content" backgroundColor={Colors.background.primary} />
      
      {/* Header */}
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
        {/* Summary Cards */}
        <View style={styles.summarySection}>
          <View style={styles.summaryRow}>
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[Colors.primary[50], Colors.primary[100]]}
                style={styles.summaryGradient}
              >
                <Text style={styles.summaryIcon}>{Icons.money}</Text>
                <Text style={styles.summaryValue}>₹{totalExpenses.toFixed(2)}</Text>
                <Text style={styles.summaryLabel}>Total Expenses</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[Colors.secondary[50], Colors.secondary[100]]}
                style={styles.summaryGradient}
              >
                <Text style={styles.summaryIcon}>{Icons.users}</Text>
                <Text style={styles.summaryValue}>{trip.participants.length}</Text>
                <Text style={styles.summaryLabel}>Members</Text>
              </LinearGradient>
            </View>
            
            <View style={styles.summaryCard}>
              <LinearGradient
                colors={[Colors.accent.purple + '20', Colors.accent.purple + '30']}
                style={styles.summaryGradient}
              >
                <Text style={styles.summaryIcon}>{Icons.expense}</Text>
                <Text style={styles.summaryValue}>{expenses.length}</Text>
                <Text style={styles.summaryLabel}>Expenses</Text>
              </LinearGradient>
            </View>
          </View>
        </View>

        {/* Balances Section */}
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
              {balances.map((balance, index) => renderBalanceItem(balance, index))}
            </View>
          )}
        </View>

        {/* Expenses Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Expenses</Text>
          {expenses.length === 0 ? (
            <View style={styles.emptyExpenses}>
              <View style={styles.emptyExpensesIcon}>
                <Text style={styles.emptyExpensesIconText}>{Icons.expense}</Text>
              </View>
              <Text style={styles.emptyExpensesTitle}>No expenses yet</Text>
              <Text style={styles.emptyExpensesSubtitle}>
                Add your first expense to get started
              </Text>
              <TouchableOpacity style={styles.emptyExpensesButton} onPress={onAddExpense}>
                <Text style={styles.emptyExpensesButtonText}>Add First Expense</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={expenses}
              renderItem={renderExpenseItem}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.expenseSeparator} />}
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
  } as ViewStyle,
  header: {
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    paddingHorizontal: Spacing.lg,
    borderBottomLeftRadius: BorderRadius.xl,
    borderBottomRightRadius: BorderRadius.xl,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  } as ViewStyle,
  backButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  } as ViewStyle,
  backIcon: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  } as TextStyle,
  headerInfo: {
    flex: 1,
  } as ViewStyle,
  tripTitle: {
    fontSize: Typography.sizes.xl,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  tripSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  } as TextStyle,
  addButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.background.tertiary,
    borderWidth: 1,
    borderColor: Colors.text.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 4,
  } as ViewStyle,
  addIcon: {
    fontSize: Typography.sizes.lg,
    color: Colors.text.primary,
  } as TextStyle,
  content: {
    flex: 1,
    paddingHorizontal: Spacing.lg,
  } as ViewStyle,
  summarySection: {
    marginTop: Spacing.lg,
    marginBottom: Spacing.xl,
  } as ViewStyle,
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  } as ViewStyle,
  summaryCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  summaryGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
    alignItems: 'center',
  } as ViewStyle,
  summaryIcon: {
    fontSize: Typography.sizes.xl,
    marginBottom: Spacing.sm,
  } as TextStyle,
  summaryValue: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  summaryLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    textAlign: 'center',
  } as TextStyle,
  section: {
    marginBottom: Spacing.xl,
  } as ViewStyle,
  sectionTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.md,
  } as TextStyle,
  emptyBalance: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  emptyBalanceIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  } as ViewStyle,
  emptyBalanceIconText: {
    fontSize: Typography.sizes.xl,
    color: Colors.success,
  } as TextStyle,
  emptyBalanceTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  } as TextStyle,
  emptyBalanceSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
  } as TextStyle,
  balancesList: {
    gap: Spacing.md,
  } as ViewStyle,

  balanceCard: {
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  balanceGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  } as ViewStyle,
  balanceContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  } as ViewStyle,
  balanceLeftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  balanceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.secondary[500],
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  } as ViewStyle,
  balanceIcon: {
    fontSize: Typography.sizes.lg,
  } as TextStyle,
  balanceInfo: {
    flex: 1,
  } as ViewStyle,
  balanceText: {
    fontSize: Typography.sizes.base,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  balanceFrom: {
    fontWeight: '600' as const,
    color: Colors.error,
  } as TextStyle,
  balanceArrow: {
    color: Colors.text.secondary,
  } as TextStyle,
  balanceTo: {
    fontWeight: '600' as const,
    color: Colors.success,
  } as TextStyle,
  balanceAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700' as const,
    color: Colors.text.primary,
  } as TextStyle,

  emptyExpenses: {
    backgroundColor: Colors.background.secondary,
    borderRadius: BorderRadius.lg,
    padding: Spacing.xl,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  emptyExpensesIcon: {
    width: 60,
    height: 60,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.primary[100],
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
  } as ViewStyle,
  emptyExpensesIconText: {
    fontSize: Typography.sizes.xl,
  } as TextStyle,
  emptyExpensesTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.sm,
  } as TextStyle,
  emptyExpensesSubtitle: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  } as TextStyle,
  emptyExpensesButton: {
    backgroundColor: Colors.primary[500],
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    borderRadius: BorderRadius.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  emptyExpensesButtonText: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.text.inverse,
  } as TextStyle,
  expenseSeparator: {
    height: Spacing.md,
  } as ViewStyle,
  expenseCard: {
    borderRadius: BorderRadius.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  } as ViewStyle,
  expenseGradient: {
    padding: Spacing.lg,
    borderRadius: BorderRadius.lg,
  } as ViewStyle,
  expenseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  } as ViewStyle,
  expenseInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  } as ViewStyle,
  expenseIcon: {
    fontSize: Typography.sizes.xl,
    marginRight: Spacing.md,
  } as TextStyle,
  expenseDetails: {
    flex: 1,
  } as ViewStyle,
  expenseDescription: {
    fontSize: Typography.sizes.base,
    fontWeight: '600' as const,
    color: Colors.text.primary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  expenseDate: {
    fontSize: Typography.sizes.sm,
    color: Colors.text.secondary,
  } as TextStyle,
  expenseAmount: {
    fontSize: Typography.sizes.lg,
    fontWeight: '700' as const,
    color: Colors.error,
  } as TextStyle,
  expenseFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  } as ViewStyle,
  expenseMeta: {
    alignItems: 'flex-start',
  } as ViewStyle,
  paidByLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  paidByValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.text.primary,
  } as TextStyle,
  splitLabel: {
    fontSize: Typography.sizes.xs,
    color: Colors.text.secondary,
    marginBottom: Spacing.xs,
  } as TextStyle,
  splitValue: {
    fontSize: Typography.sizes.sm,
    fontWeight: '500' as const,
    color: Colors.text.primary,
  } as TextStyle,
  balanceSettleButton: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.full,
    backgroundColor: Colors.success + '20',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  } as ViewStyle,
  balanceSettleIcon: {
    fontSize: Typography.sizes.xl,
    color: Colors.success,
  } as TextStyle,
}); 

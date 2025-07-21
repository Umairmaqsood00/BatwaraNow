import React from 'react';
import {
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

type Balance = {
  from: string;
  to: string;
  amount: number;
};

type BalanceSummaryProps = {
  balances: Balance[];
  participants: string[];
};

export default function BalanceSummary({ balances, participants }: BalanceSummaryProps) {
  const totalOwed = balances.reduce((sum, balance) => sum + Math.abs(balance.amount), 0);

  const renderBalanceItem = (balance: Balance, index: number) => (
    <View key={index} style={styles.balanceItem}>
      <View style={styles.balanceInfo}>
        <Text style={styles.fromText}>{balance.from}</Text>
        <Text style={styles.arrowText}>→</Text>
        <Text style={styles.toText}>{balance.to}</Text>
      </View>
      <Text style={styles.amountText}>Rs.{balance.amount.toFixed(2)}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Balances</Text>
        <Text style={styles.totalAmount}>Rs.{totalOwed.toFixed(2)}</Text>
      </View>

      {balances.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>All settled up! 🎉</Text>
          <Text style={styles.emptyStateSubtext}>
            No outstanding balances between participants
          </Text>
        </View>
      ) : (
        <ScrollView style={styles.balancesList} showsVerticalScrollIndicator={false}>
          {balances.map((balance, index) => renderBalanceItem(balance, index))}
        </ScrollView>
      )}

      <View style={styles.participantsSection}>
        <Text style={styles.participantsTitle}>Participants ({participants.length})</Text>
        <View style={styles.participantsList}>
          {participants.map((participant, index) => (
            <View key={index} style={styles.participantItem}>
              <View style={styles.participantDot} />
              <Text style={styles.participantName}>{participant}</Text>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 20,
    margin: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#e74c3c',
  },
  balancesList: {
    maxHeight: 200,
  },
  balanceItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  balanceInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  fromText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  arrowText: {
    fontSize: 16,
    color: '#7f8c8d',
    marginHorizontal: 8,
  },
  toText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#27ae60',
  },
  amountText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#2c3e50',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#27ae60',
    marginBottom: 4,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
  participantsSection: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  participantsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 12,
  },
  participantsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  participantItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginBottom: 8,
  },
  participantDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3498db',
    marginRight: 6,
  },
  participantName: {
    fontSize: 14,
    color: '#2c3e50',
  },
}); 
import { Colors } from '@/constants/DesignSystem';
import React, { useEffect, useState } from 'react';
import { Alert, StatusBar, StyleSheet, View } from 'react-native';

import AddExpenseScreen from '@/components/AddExpenseScreen';
import CreateTripScreen from '@/components/CreateTripScreen';
import TripDetailScreen from '@/components/TripDetailScreen';
import TripListScreen from '@/components/TripListScreen';
import { calculateBalances, calculateTripSummary } from '@/utils/balanceCalculator';
import { generateId, storage, type Balance, type Expense, type Trip } from '@/utils/storage';

// ✅ Step 1: Ensure Proper Import - Check available methods
console.log('Available storage methods:', Object.keys(storage));

type Screen = 'trips' | 'tripDetail' | 'addExpense' | 'createTrip';

export default function ExpenseSplitApp() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('trips');
  const [selectedTripId, setSelectedTripId] = useState<string | null>(null);
  const [trips, setTrips] = useState<Trip[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settledBalances, setSettledBalances] = useState<Balance[]>([]);
  const [loading, setLoading] = useState(true);

  // Load data from storage on app start
  useEffect(() => {
    loadData();
    // ✅ Step 1: Test storage methods on app start
    testStorageMethods();
  }, []);

  const testStorageMethods = async () => {
    console.log('=== TESTING STORAGE METHODS ===');
    try {
      console.log('Testing getTrips...');
      const testTrips = await storage.getTrips();
      console.log('getTrips result:', testTrips.length, 'trips');
      
      console.log('Testing getExpenses...');
      const testExpenses = await storage.getExpenses();
      console.log('getExpenses result:', testExpenses.length, 'expenses');
      
      console.log('Testing getSettledBalances...');
      const testBalances = await storage.getSettledBalances();
      console.log('getSettledBalances result:', testBalances.length, 'balances');
      
      console.log('=== STORAGE METHODS TEST COMPLETED ===');
    } catch (error) {
      console.error('=== STORAGE METHODS TEST FAILED ===', error);
    }
  };

  const loadData = async () => {
    try {
      const [loadedTrips, loadedExpenses, loadedSettledBalances] = await Promise.all([
        storage.getTrips(),
        storage.getExpenses(),
        storage.getSettledBalances(),
      ]);
      setTrips(loadedTrips);
      setExpenses(loadedExpenses);
      setSettledBalances(loadedSettledBalances);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const refreshData = async () => {
    try {
      console.log('Refreshing data from storage...');
      const [loadedTrips, loadedExpenses, loadedSettledBalances] = await Promise.all([
        storage.getTrips(),
        storage.getExpenses(),
        storage.getSettledBalances(),
      ]);
      setTrips(loadedTrips);
      setExpenses(loadedExpenses);
      setSettledBalances(loadedSettledBalances);
      console.log('Data refreshed successfully');
      console.log('Trips:', loadedTrips.length);
      console.log('Expenses:', loadedExpenses.length);
      console.log('Settled balances:', loadedSettledBalances.length);
    } catch (error) {
      console.error('Error refreshing data:', error);
    }
  };

  const selectedTrip = trips.find(trip => trip.id === selectedTripId);
  const tripExpenses = selectedTrip 
    ? expenses.filter(expense => expense.tripId === selectedTrip.id)
    : [];
  const allBalances = selectedTrip ? calculateBalances(tripExpenses) : [];
  const balances = allBalances.filter(balance => 
    !settledBalances.some(settled => 
      settled.from === balance.from && settled.to === balance.to
    )
  );
  const tripSummary = selectedTrip ? calculateTripSummary(tripExpenses) : null;

  const handleTripPress = (tripId: string) => {
    setSelectedTripId(tripId);
    setCurrentScreen('tripDetail');
  };

  const handleCreateNewTrip = () => {
    setCurrentScreen('createTrip');
  };

  const handleSaveTrip = async (tripData: { name: string; participants: string[] }) => {
    const newTrip: Trip = {
      id: generateId(),
      name: tripData.name,
      participants: tripData.participants,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await storage.addTrip(newTrip);
      setTrips(prev => [...prev, newTrip]);
      setSelectedTripId(newTrip.id);
      setCurrentScreen('tripDetail');
    } catch (error) {
      console.error('Error saving trip:', error);
    }
  };

  const handleCancelCreateTrip = () => {
    setCurrentScreen('trips');
  };

  const handleAddExpense = () => {
    setCurrentScreen('addExpense');
  };

  const handleSaveExpense = async (expenseData: {
    description: string;
    amount: number;
    paidBy: string;
    splitBetween: string[];
  }) => {
    if (!selectedTripId) return;

    const newExpense: Expense = {
      id: generateId(),
      tripId: selectedTripId,
      ...expenseData,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      await storage.addExpense(newExpense);
      setExpenses(prev => [...prev, newExpense]);
      setCurrentScreen('tripDetail');
    } catch (error) {
      console.error('Error saving expense:', error);
    }
  };

  const handleCancelAddExpense = () => {
    setCurrentScreen('tripDetail');
  };

  const handleBackFromTripDetail = () => {
    setCurrentScreen('trips');
    setSelectedTripId(null);
  };

  const handleDeleteTrip = async (tripId: string) => {
    console.log('=== DELETE TRIP FUNCTION CALLED ===');
    console.log('Trip ID to delete:', tripId);
    
    try {
      // ✅ Step 3: Check deleteTrip Usage - Proper await with try-catch
      console.log('Calling storage.deleteTrip...');
      await storage.deleteTrip(tripId);
      console.log('Storage deleteTrip completed successfully');
      
      // Update UI after successful storage deletion
      setTrips(prev => {
        const updated = prev.filter(trip => trip.id !== tripId);
        console.log('Trips before:', prev.length, 'Trips after:', updated.length);
        return updated;
      });
      
      setExpenses(prev => {
        const updated = prev.filter(expense => expense.tripId !== tripId);
        console.log('Expenses before:', prev.length, 'Expenses after:', updated.length);
        return updated;
      });
      
      // Clear settled balances for this trip
      const tripExpenses = expenses.filter(exp => exp.tripId === tripId);
      const tripBalances = calculateBalances(tripExpenses);
      const updatedSettledBalances = settledBalances.filter(settled => 
        !tripBalances.some(balance => 
          balance.from === settled.from && balance.to === settled.to
        )
      );
      setSettledBalances(updatedSettledBalances);
      await storage.saveSettledBalances(updatedSettledBalances);
      
      // If we're currently viewing the deleted trip, go back to trips list
      if (selectedTripId === tripId) {
        setSelectedTripId(null);
        setCurrentScreen('trips');
      }
      
      console.log('=== TRIP DELETED SUCCESSFULLY ===');
      Alert.alert('Success!', 'Trip has been deleted.');
    } catch (error) {
      console.error('=== ERROR DELETING TRIP ===', error);
      Alert.alert('Error', 'Failed to delete trip. Please try again.');
    }
  };

  const handleDeleteExpense = async (expenseId: string) => {
    try {
      await storage.deleteExpense(expenseId);
      setExpenses(prev => prev.filter(expense => expense.id !== expenseId));
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  };

  const handleUpdateExpense = async (expenseId: string, updatedData: {
    description: string;
    amount: number;
    paidBy: string;
    splitBetween: string[];
  }) => {
    const expense = expenses.find(e => e.id === expenseId);
    if (!expense) return;

    const updatedExpense: Expense = {
      ...expense,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    try {
      await storage.updateExpense(updatedExpense);
      setExpenses(prev => 
        prev.map(exp => exp.id === expenseId ? updatedExpense : exp)
      );
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleSettleBalance = async (from: string, to: string) => {
    console.log('=== SETTLE BALANCE FUNCTION CALLED ===');
    console.log('From:', from, 'To:', to);
    
    const balanceToSettle = balances.find(b => b.from === from && b.to === to);
    console.log('Balance found:', balanceToSettle);
    
    if (balanceToSettle) {
      try {
        const settledBalance: Balance = {
          ...balanceToSettle,
          isSettled: true,
          settledAt: new Date().toISOString(),
        };
        
        // ✅ Step 3: Check addSettledBalance Usage - Proper await with try-catch
        console.log('Calling storage.addSettledBalance...');
        await storage.addSettledBalance(settledBalance);
        console.log('Storage addSettledBalance completed successfully');
        
        // Update UI after successful storage operation
        setSettledBalances(prev => {
          const updated = [...prev, settledBalance];
          console.log('Settled balances before:', prev.length, 'after:', updated.length);
          return updated;
        });
        
        console.log('=== BALANCE SETTLED SUCCESSFULLY ===');
        Alert.alert('Success!', `${from} has paid ${to} ₹${balanceToSettle.amount.toFixed(2)}`);
      } catch (error) {
        console.error('=== ERROR SETTLING BALANCE ===', error);
        Alert.alert('Error', 'Failed to settle balance. Please try again.');
      }
    } else {
      console.log('=== NO BALANCE FOUND ===');
      Alert.alert('Error', 'Balance not found. Please try again.');
    }
  };

  const handleUpdateTrip = async (tripId: string, updatedData: {
    name: string;
    participants: string[];
  }) => {
    const trip = trips.find(t => t.id === tripId);
    if (!trip) return;

    const updatedTrip: Trip = {
      ...trip,
      ...updatedData,
      updatedAt: new Date().toISOString(),
    };

    try {
      await storage.updateTrip(updatedTrip);
      setTrips(prev => 
        prev.map(t => t.id === tripId ? updatedTrip : t)
      );
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  };

  const handleClearAllData = async () => {
    Alert.alert(
      'Clear All Data',
      'Are you sure you want to delete ALL trips, expenses, and settings? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Clear All Data', 
          style: 'destructive',
          onPress: async () => {
            try {
              console.log('Clearing all data...');
              await storage.clearAllData();
              setTrips([]);
              setExpenses([]);
              setSettledBalances([]);
              setSelectedTripId(null);
              setCurrentScreen('trips');
              Alert.alert('Success', 'All data has been cleared successfully.');
              console.log('All data cleared successfully');
            } catch (error) {
              console.error('Error clearing all data:', error);
              Alert.alert('Error', 'Failed to clear all data. Please try again.');
            }
          }
        },
      ]
    );
  };

  const renderScreen = () => {
    if (loading) {
      return null; // You could add a loading screen here
    }

    switch (currentScreen) {
      case 'trips':
        return (
          <TripListScreen
            trips={trips.map(trip => {
              const tripExpenses = expenses.filter(exp => exp.tripId === trip.id);
              const summary = calculateTripSummary(tripExpenses);
              return {
                ...trip,
                totalExpenses: summary.totalExpenses,
                expenseCount: summary.expenseCount,
              };
            })}
            onTripPress={handleTripPress}
            onCreateNewTrip={handleCreateNewTrip}
            onDeleteTrip={handleDeleteTrip}
            onClearAllData={handleClearAllData}
            onRefreshData={refreshData}
          />
        );

      case 'createTrip':
        return (
          <CreateTripScreen
            onSave={handleSaveTrip}
            onCancel={handleCancelCreateTrip}
          />
        );

      case 'tripDetail':
        if (!selectedTrip) return null;
        return (
          <TripDetailScreen
            trip={selectedTrip}
            expenses={tripExpenses}
            balances={balances}
            summary={tripSummary || undefined}
            onAddExpense={handleAddExpense}
            onBack={handleBackFromTripDetail}
            onDeleteExpense={handleDeleteExpense}
            onUpdateExpense={handleUpdateExpense}
            onSettleBalance={handleSettleBalance}
            onUpdateTrip={handleUpdateTrip}
          />
        );

      case 'addExpense':
        if (!selectedTrip) return null;
        return (
          <AddExpenseScreen
            participants={selectedTrip.participants}
            onSave={handleSaveExpense}
            onCancel={handleCancelAddExpense}
          />
        );

      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar 
        barStyle="light-content" 
        backgroundColor={Colors.background.primary}
        translucent={false}
      />
      {renderScreen()}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background.primary,
  },
});

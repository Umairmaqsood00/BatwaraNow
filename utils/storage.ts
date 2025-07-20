import AsyncStorage from '@react-native-async-storage/async-storage';
const STORAGE_KEYS = {
  TRIPS: 'expense_tracker_trips',
  EXPENSES: 'expense_tracker_expenses',
  SETTINGS: 'expense_tracker_settings',
  SETTLED_BALANCES: 'expense_tracker_settled_balances',
};
export type Trip = {
  id: string;
  name: string;
  participants: string[];
  createdAt: string;
  updatedAt: string;
};

export type Expense = {
  id: string;
  tripId: string;
  description: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  date: string;
  createdAt: string;
  updatedAt: string;
};

export type Balance = {
  from: string;
  to: string;
  amount: number;
  isSettled: boolean;
  settledAt?: string;
};

export type Settings = {
  currency: string;
  theme: 'dark' | 'light';
  notifications: boolean;
};
class StorageManager {
  async getTrips(): Promise<Trip[]> {
    try {
      const tripsJson = await AsyncStorage.getItem(STORAGE_KEYS.TRIPS);
      return tripsJson ? JSON.parse(tripsJson) : [];
    } catch (error) {
      console.error('Error getting trips:', error);
      return [];
    }
  }

  async saveTrips(trips: Trip[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.TRIPS, JSON.stringify(trips));
    } catch (error) {
      console.error('Error saving trips:', error);
    }
  }

  async addTrip(trip: Trip): Promise<void> {
    try {
      const trips = await this.getTrips();
      trips.push(trip);
      await this.saveTrips(trips);
    } catch (error) {
      console.error('Error adding trip:', error);
    }
  }

  async updateTrip(updatedTrip: Trip): Promise<void> {
    try {
      const trips = await this.getTrips();
      const index = trips.findIndex(trip => trip.id === updatedTrip.id);
      if (index !== -1) {
        trips[index] = updatedTrip;
        await this.saveTrips(trips);
      }
    } catch (error) {
      console.error('Error updating trip:', error);
    }
  }

  async deleteTrip(tripId: string): Promise<void> {
    console.log('Storage: deleteTrip called with tripId:', tripId);
    try {
      const trips = await this.getTrips();
      console.log('Storage: Current trips:', trips.length);
      const filteredTrips = trips.filter(trip => trip.id !== tripId);
      console.log('Storage: Filtered trips:', filteredTrips.length);
      await this.saveTrips(filteredTrips);
      
      await this.deleteExpensesByTripId(tripId);
      console.log('Storage: Trip deleted successfully');
    } catch (error) {
      console.error('Error deleting trip:', error);
    }
  }
  async getExpenses(): Promise<Expense[]> {
    try {
      const expensesJson = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return expensesJson ? JSON.parse(expensesJson) : [];
    } catch (error) {
      console.error('Error getting expenses:', error);
      return [];
    }
  }

  async getExpensesByTripId(tripId: string): Promise<Expense[]> {
    try {
      const expenses = await this.getExpenses();
      return expenses.filter(expense => expense.tripId === tripId);
    } catch (error) {
      console.error('Error getting expenses by trip ID:', error);
      return [];
    }
  }

  async saveExpenses(expenses: Expense[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.EXPENSES, JSON.stringify(expenses));
    } catch (error) {
      console.error('Error saving expenses:', error);
    }
  }

  async addExpense(expense: Expense): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      expenses.push(expense);
      await this.saveExpenses(expenses);
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  }

  async updateExpense(updatedExpense: Expense): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      const index = expenses.findIndex(expense => expense.id === updatedExpense.id);
      if (index !== -1) {
        expenses[index] = updatedExpense;
        await this.saveExpenses(expenses);
      }
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  }

  async deleteExpense(expenseId: string): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(expense => expense.id !== expenseId);
      await this.saveExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error deleting expense:', error);
    }
  }

  async deleteExpensesByTripId(tripId: string): Promise<void> {
    try {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(expense => expense.tripId !== tripId);
      await this.saveExpenses(filteredExpenses);
    } catch (error) {
      console.error('Error deleting expenses by trip ID:', error);
    }
  }
  async getSettings(): Promise<Settings> {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsJson ? JSON.parse(settingsJson) : {
        currency: '₹',
        theme: 'dark',
        notifications: true,
      };
    } catch (error) {
      console.error('Error getting settings:', error);
      return {
        currency: '₹',
        theme: 'dark',
        notifications: true,
      };
    }
  }

  async saveSettings(settings: Settings): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving settings:', error);
    }
  }
  async getSettledBalances(): Promise<Balance[]> {
    try {
      const balancesJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTLED_BALANCES);
      return balancesJson ? JSON.parse(balancesJson) : [];
    } catch (error) {
      console.error('Error getting settled balances:', error);
      return [];
    }
  }

  async saveSettledBalances(balances: Balance[]): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.SETTLED_BALANCES, JSON.stringify(balances));
    } catch (error) {
      console.error('Error saving settled balances:', error);
    }
  }

  async addSettledBalance(balance: Balance): Promise<void> {
    console.log('Storage: addSettledBalance called with balance:', balance);
    try {
      const balances = await this.getSettledBalances();
      console.log('Storage: Current settled balances:', balances.length);
      balances.push(balance);
      await this.saveSettledBalances(balances);
      console.log('Storage: Settled balance added successfully');
    } catch (error) {
      console.error('Error adding settled balance:', error);
    }
  }

  async updateSettledBalance(updatedBalance: Balance): Promise<void> {
    try {
      const balances = await this.getSettledBalances();
      const index = balances.findIndex(balance => balance.from === updatedBalance.from && balance.to === updatedBalance.to);
      if (index !== -1) {
        balances[index] = updatedBalance;
        await this.saveSettledBalances(balances);
      }
    } catch (error) {
      console.error('Error updating settled balance:', error);
    }
  }

  async deleteSettledBalance(from: string, to: string): Promise<void> {
    try {
      const balances = await this.getSettledBalances();
      const filteredBalances = balances.filter(balance => !(balance.from === from && balance.to === to));
      await this.saveSettledBalances(filteredBalances);
    } catch (error) {
      console.error('Error deleting settled balance:', error);
    }
  }
  async clearAllData(): Promise<void> {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRIPS,
        STORAGE_KEYS.EXPENSES,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.SETTLED_BALANCES,
      ]);
    } catch (error) {
      console.error('Error clearing all data:', error);
    }
  }

  async exportData(): Promise<{ trips: Trip[]; expenses: Expense[]; settings: Settings }> {
    try {
      const [trips, expenses, settings] = await Promise.all([
        this.getTrips(),
        this.getExpenses(),
        this.getSettings(),
      ]);
      
      return { trips, expenses, settings };
    } catch (error) {
      console.error('Error exporting data:', error);
      return { trips: [], expenses: [], settings: await this.getSettings() };
    }
  }

  async importData(data: { trips: Trip[]; expenses: Expense[]; settings: Settings }): Promise<void> {
    try {
      await Promise.all([
        this.saveTrips(data.trips),
        this.saveExpenses(data.expenses),
        this.saveSettings(data.settings),
      ]);
    } catch (error) {
      console.error('Error importing data:', error);
    }
  }
}
export const storage = new StorageManager();
export const generateId = (): string => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export const formatCurrency = (amount: number, currency: string = '₹'): string => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const formatDateTime = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}; 
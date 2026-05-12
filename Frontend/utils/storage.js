import AsyncStorage from "@react-native-async-storage/async-storage";
import { Platform } from "react-native";

import { API_URL, fetchWithTimeout, parseJsonResponse } from "./api";
import { normalizeMongoId } from "./userSession";

const LOG = "[BatwaraNow][storage]";

const STORAGE_KEYS = {
  TRIPS: "expense_tracker_trips",
  EXPENSES: "expense_tracker_expenses",
  SETTINGS: "expense_tracker_settings",
  SETTLED_BALANCES: "expense_tracker_settled_balances",
};
const SETTLEMENT_HISTORY_KEY = "settlement_history";

/** Same keys as AuthContext */
const AUTH_TOKEN_KEY = "batwaranow_auth_token";
const AUTH_USER_KEY = "batwaranow_auth_user";

export async function clearLocalUserDataCache() {
  try {
    await AsyncStorage.multiRemove([
      STORAGE_KEYS.TRIPS,
      STORAGE_KEYS.EXPENSES,
      STORAGE_KEYS.SETTLED_BALANCES,
      SETTLEMENT_HISTORY_KEY,
    ]);
  } catch (e) {
    console.warn(`${LOG} clearLocalUserDataCache`, e);
  }
}

class StorageManager {
  isWeb = Platform.OS === "web";

  async ensureStorageAvailable() {
    if (this.isWeb) {
      try {
        if (typeof window !== "undefined" && window.localStorage) {
          return true;
        }
        await AsyncStorage.setItem("test", "test");
        await AsyncStorage.removeItem("test");
        return true;
      } catch (error) {
        console.error("Web storage not available:", error);
        return false;
      }
    }
    return true;
  }

  async _authHeaders() {
    const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
    if (!token) return {};
    return { Authorization: `Bearer ${token}` };
  }

  async webStorageGetItem(key) {
    if (this.isWeb && typeof window !== "undefined" && window.localStorage) {
      return window.localStorage.getItem(key);
    }
    return await AsyncStorage.getItem(key);
  }

  async webStorageSetItem(key, value) {
    if (this.isWeb && typeof window !== "undefined" && window.localStorage) {
      window.localStorage.setItem(key, value);
      return;
    }
    await AsyncStorage.setItem(key, value);
  }
  async getTrips() {
    try {
      const url = `${API_URL}/trips`;
      const auth = await this._authHeaders();
      if (!auth.Authorization) {
        console.warn(`${LOG} getTrips: no auth token`);
        return [];
      }
      const response = await fetchWithTimeout(url, { headers: { ...auth } });
      if (response.status === 401 || response.status === 403) {
        console.warn(`${LOG} getTrips unauthorized`);
        return [];
      }
      const json = await parseJsonResponse(response, url);

      if (json.success) {
        const list = (json.data || []).map((trip) => ({
          ...trip,
          id: trip._id,
        }));
        // If the API returns mixed users' rows, only show trips owned by this login.
        try {
          const rawUser = await AsyncStorage.getItem(AUTH_USER_KEY);
          if (!rawUser) return [];
          const u = JSON.parse(rawUser);
          const sessionUserId = u.id ?? u._id;
          if (sessionUserId == null || sessionUserId === "") return [];
          const want = normalizeMongoId(sessionUserId);
          if (!want) return [];
          return list.filter((t) => normalizeMongoId(t.userId) === want);
        } catch (_) {
          return [];
        }
      }

      return [];
    } catch (error) {
      console.warn(`${LOG} getTrips failed`, error?.message || error);
      return [];
    }
  }

  async saveTrips(trips) {
    try {
      const tripsJson = JSON.stringify(trips);
      console.log(
        "Storage: Saving trips JSON:",
        tripsJson.substring(0, 100) + "...",
      );
      await this.webStorageSetItem(STORAGE_KEYS.TRIPS, tripsJson);

      const verification = await this.webStorageGetItem(STORAGE_KEYS.TRIPS);
      console.log(
        "Storage: Verification - saved trips length:",
        verification ? JSON.parse(verification).length : 0,
      );
    } catch (error) {
      console.error("Error saving trips:", error);
      throw error;
    }
  }

  async addTrip(trip) {
    const auth = await this._authHeaders();
    if (!auth.Authorization) {
      throw new Error("Please sign in to create a trip.");
    }
    try {
      const url = `${API_URL}/trips`;
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({
          name: trip.name,
          participants: trip.participants,
        }),
      });

      if (response.status === 401) {
        throw new Error("Session expired. Please sign in again.");
      }

      const json = await parseJsonResponse(response, url);
      if (!json.success) throw new Error(json.error);

      // Also save locally as backup
      const trips = await this.getTrips();
      const savedTrip = { ...trip, id: json.data._id };
      trips.push(savedTrip);
      await this.saveTrips(trips);
      return savedTrip;
    } catch (error) {
      console.error("Error adding trip to API:", error);
      throw error;
    }
  }

  async updateTrip(updatedTrip) {
    try {
      const trips = await this.getTrips();
      const index = trips.findIndex((trip) => trip.id === updatedTrip.id);
      if (index !== -1) {
        trips[index] = updatedTrip;
        await this.saveTrips(trips);
      }
    } catch (error) {
      console.error("Error updating trip:", error);
    }
  }

  async deleteTrip(tripId) {
    const id = String(tripId);
    console.log(`${LOG} deleteTrip`, id);

    const storageAvailable = await this.ensureStorageAvailable();
    if (!storageAvailable) {
      throw new Error("Storage not available");
    }

    try {
      const url = `${API_URL}/trips/${encodeURIComponent(id)}`;
      const auth = await this._authHeaders();
      const response = await fetchWithTimeout(url, {
        method: "DELETE",
        headers: { ...auth },
      });
      const json = await parseJsonResponse(response, url);
      if (!response.ok && response.status !== 404) {
        console.warn(`${LOG} deleteTrip API`, response.status, json?.error);
      }
    } catch (e) {
      console.warn(`${LOG} deleteTrip API failed; applying local removal`, e?.message || e);
    }

    await this.deleteExpensesByTripId(id);

    const trips = await this.getTrips();
    const filteredTrips = trips.filter((trip) => String(trip.id) !== id);
    await this.saveTrips(filteredTrips);
  }
  async getExpenses() {
    try {
      // Note: In a real app, we'd fetch expenses per trip.
      // For now, we'll rely on the getTrip endpoint or fetch all if needed.
      const expensesJson = await AsyncStorage.getItem(STORAGE_KEYS.EXPENSES);
      return expensesJson ? JSON.parse(expensesJson) : [];
    } catch (error) {
      console.error("Error getting expenses:", error);
      return [];
    }
  }

  async getExpensesByTripId(tripId) {
    try {
      const url = `${API_URL}/trips/${tripId}`;
      const auth = await this._authHeaders();
      if (!auth.Authorization) {
        const expenses = await this.getExpenses();
        return expenses.filter((expense) => String(expense.tripId) === String(tripId));
      }
      const response = await fetchWithTimeout(url, { headers: { ...auth } });
      if (response.status === 401 || response.status === 403) {
        const expenses = await this.getExpenses();
        return expenses.filter((expense) => String(expense.tripId) === String(tripId));
      }
      const json = await parseJsonResponse(response, url);

      if (json.success && json.data.expenses) {
        return json.data.expenses.map((exp) => ({
          ...exp,
          id: exp._id,
        }));
      }

      const expenses = await this.getExpenses();
      return expenses.filter((expense) => String(expense.tripId) === String(tripId));
    } catch (error) {
      console.warn(`${LOG} getExpensesByTripId API failed`, tripId, error?.message || error);
      const expenses = await this.getExpenses();
      return expenses.filter((expense) => String(expense.tripId) === String(tripId));
    }
  }

  async saveExpenses(expenses) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.EXPENSES,
        JSON.stringify(expenses),
      );
    } catch (error) {
      console.error("Error saving expenses:", error);
    }
  }

  async addExpense(expense) {
    const auth = await this._authHeaders();
    if (!auth.Authorization) {
      throw new Error("Please sign in to add expenses.");
    }
    try {
      const url = `${API_URL}/expenses`;
      const response = await fetchWithTimeout(url, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...auth },
        body: JSON.stringify({
          tripId: expense.tripId,
          amount: expense.amount,
          paidBy: expense.paidBy[0]?.name || "Unknown", // Backend expects String for now based on prompt
          splitBetween: expense.splitBetween.map((name) => ({
            name,
            amount: expense.amount / expense.splitBetween.length,
          })),
        }),
      });

      if (response.status === 401) {
        throw new Error("Session expired. Please sign in again.");
      }

      const json = await parseJsonResponse(response, url);
      if (!json.success) throw new Error(json.error);

      const expenses = await this.getExpenses();
      expenses.push({ ...expense, id: json.data._id });
      await this.saveExpenses(expenses);
    } catch (error) {
      console.error("Error adding expense to API:", error);
      throw error;
    }
  }

  async updateExpense(updatedExpense) {
    try {
      const expenses = await this.getExpenses();
      const index = expenses.findIndex(
        (expense) => expense.id === updatedExpense.id,
      );
      if (index !== -1) {
        expenses[index] = updatedExpense;
        await this.saveExpenses(expenses);
      }
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  }

  async deleteExpense(expenseId) {
    try {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(
        (expense) => expense.id !== expenseId,
      );
      await this.saveExpenses(filteredExpenses);
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  }

  async deleteExpensesByTripId(tripId) {
    try {
      const expenses = await this.getExpenses();
      const filteredExpenses = expenses.filter(
        (expense) => expense.tripId !== tripId,
      );
      await this.saveExpenses(filteredExpenses);
    } catch (error) {
      console.error("Error deleting expenses by trip ID:", error);
    }
  }
  async getSettings() {
    try {
      const settingsJson = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      return settingsJson
        ? JSON.parse(settingsJson)
        : {
            currency: "Rs.",
            theme: "dark",
            notifications: true,
          };
    } catch (error) {
      console.error("Error getting settings:", error);
      return {
        currency: "Rs.",
        theme: "dark",
        notifications: true,
      };
    }
  }

  async saveSettings(settings) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTINGS,
        JSON.stringify(settings),
      );
    } catch (error) {
      console.error("Error saving settings:", error);
    }
  }
  async getSettledBalances() {
    try {
      const balancesJson = await AsyncStorage.getItem(
        STORAGE_KEYS.SETTLED_BALANCES,
      );
      return balancesJson ? JSON.parse(balancesJson) : [];
    } catch (error) {
      console.error("Error getting settled balances:", error);
      return [];
    }
  }

  async saveSettledBalances(balances) {
    try {
      await AsyncStorage.setItem(
        STORAGE_KEYS.SETTLED_BALANCES,
        JSON.stringify(balances),
      );
    } catch (error) {
      console.error("Error saving settled balances:", error);
    }
  }

  async addSettledBalance(balance) {
    console.log("Storage: addSettledBalance called with balance:", balance);
    try {
      const balances = await this.getSettledBalances();
      console.log("Storage: Current settled balances:", balances.length);
      balances.push(balance);
      await this.saveSettledBalances(balances);
      console.log("Storage: Settled balance added successfully");
    } catch (error) {
      console.error("Error adding settled balance:", error);
    }
  }

  async updateSettledBalance(updatedBalance) {
    try {
      const balances = await this.getSettledBalances();
      const index = balances.findIndex(
        (balance) =>
          balance.from === updatedBalance.from &&
          balance.to === updatedBalance.to,
      );
      if (index !== -1) {
        balances[index] = updatedBalance;
        await this.saveSettledBalances(balances);
      }
    } catch (error) {
      console.error("Error updating settled balance:", error);
    }
  }

  async deleteSettledBalance(from, to) {
    try {
      const balances = await this.getSettledBalances();
      const filteredBalances = balances.filter(
        (balance) => !(balance.from === from && balance.to === to),
      );
      await this.saveSettledBalances(filteredBalances);
    } catch (error) {
      console.error("Error deleting settled balance:", error);
    }
  }
  async getSettlementHistory() {
    try {
      const historyJson = await AsyncStorage.getItem(SETTLEMENT_HISTORY_KEY);
      return historyJson ? JSON.parse(historyJson) : [];
    } catch (error) {
      console.error("Error getting settlement history:", error);
      return [];
    }
  }

  async addSettlementHistory(entry) {
    try {
      const history = await this.getSettlementHistory();
      history.push(entry);
      await AsyncStorage.setItem(
        SETTLEMENT_HISTORY_KEY,
        JSON.stringify(history),
      );
    } catch (error) {
      console.error("Error adding settlement history:", error);
    }
  }

  async clearSettlementHistory() {
    try {
      await AsyncStorage.removeItem(SETTLEMENT_HISTORY_KEY);
    } catch (error) {
      console.error("Error clearing settlement history:", error);
    }
  }
  async clearAllData() {
    try {
      await AsyncStorage.multiRemove([
        STORAGE_KEYS.TRIPS,
        STORAGE_KEYS.EXPENSES,
        STORAGE_KEYS.SETTINGS,
        STORAGE_KEYS.SETTLED_BALANCES,
      ]);
    } catch (error) {
      console.error("Error clearing all data:", error);
    }
  }

  async exportData() {
    try {
      const [trips, expenses, settings] = await Promise.all([
        this.getTrips(),
        this.getExpenses(),
        this.getSettings(),
      ]);

      return { trips, expenses, settings };
    } catch (error) {
      console.error("Error exporting data:", error);
      return { trips: [], expenses: [], settings: await this.getSettings() };
    }
  }

  async importData(data) {
    try {
      await Promise.all([
        this.saveTrips(data.trips),
        this.saveExpenses(data.expenses),
        this.saveSettings(data.settings),
      ]);
    } catch (error) {
      console.error("Error importing data:", error);
    }
  }
}
export const storage = new StorageManager();
export const generateId = () => {
  return Date.now().toString() + Math.random().toString(36).substring(2, 9);
};

export const formatCurrency = (amount, currency = "Rs.") => {
  return `${currency}${amount.toFixed(2)}`;
};

export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (dateString) => {
  const date = new Date(dateString);
  return date.toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

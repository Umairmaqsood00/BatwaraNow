import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter, useSegments } from "expo-router";
import React, { createContext, useContext, useEffect, useState } from "react";

import { clearLocalUserDataCache } from "../utils/storage";

const LOG = "[BatwaraNow][auth]";
const TOKEN_KEY = "batwaranow_auth_token";
const USER_KEY = "batwaranow_auth_user";

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user, isLoading) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === "(auth)";

    if (!user && !inAuthGroup) {
      console.log(`${LOG} redirect → login (segments=${JSON.stringify(segments)})`);
      router.replace("/(auth)/login");
    } else if (user && inAuthGroup) {
      console.log(`${LOG} redirect → drawer (authenticated)`);
      router.replace("/(drawer)");
    }
  }, [user, segments, isLoading, router]);
}

export function AuthProvider({ children }) {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadAuthData = async () => {
      console.log(`${LOG} restoring session from AsyncStorage…`);
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          try {
            setToken(storedToken);
            setUser(JSON.parse(storedUser));
            console.log(`${LOG} session restored`);
          } catch (parseErr) {
            console.warn(`${LOG} corrupt user JSON, clearing keys`, parseErr);
            await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
          }
        } else {
          console.log(`${LOG} no stored session`);
        }
      } catch (error) {
        console.error(`${LOG} AsyncStorage error:`, error);
      } finally {
        setIsLoading(false);
        console.log(`${LOG} bootstrap complete`);
      }
    };

    loadAuthData();
  }, []);

  useProtectedRoute(user, isLoading);

  const login = async (newToken, userData) => {
    try {
      // Wipe previous account’s local trips/expenses so Expo Go / same device never shows wrong user.
      await clearLocalUserDataCache();
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error("Error saving auth data:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await clearLocalUserDataCache();
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
      router.replace("/(auth)/login");
    } catch (error) {
      console.error("Error removing auth data:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

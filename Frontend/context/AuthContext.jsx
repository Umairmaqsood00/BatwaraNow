import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

const API_URL = 'http://192.168.100.70:5000/api';
const TOKEN_KEY = 'batwaranow_auth_token';
const USER_KEY = 'batwaranow_auth_user';

const AuthContext = createContext({
  user: null,
  token: null,
  isLoading: true,
  login: async () => { },
  logout: async () => { },
});

export function useAuth() {
  return useContext(AuthContext);
}

function useProtectedRoute(user, isLoading) {
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login if not authenticated and not in auth group
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Redirect away from login if authenticated
      router.replace('/(drawer)');
    }
  }, [user, segments, isLoading]);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Load token and user on startup
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem(TOKEN_KEY);
        const storedUser = await AsyncStorage.getItem(USER_KEY);

        if (storedToken && storedUser) {
          setToken(storedToken);
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error loading auth data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAuthData();
  }, []);

  useProtectedRoute(user, isLoading);

  const login = async (newToken, userData) => {
    try {
      await AsyncStorage.setItem(TOKEN_KEY, newToken);
      await AsyncStorage.setItem(USER_KEY, JSON.stringify(userData));
      setToken(newToken);
      setUser(userData);
    } catch (error) {
      console.error('Error saving auth data:', error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_KEY);
      setToken(null);
      setUser(null);
    } catch (error) {
      console.error('Error removing auth data:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

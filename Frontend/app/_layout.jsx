import "react-native-gesture-handler";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { useCallback, useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "../hooks/useColorScheme";

import { AuthProvider } from "../context/AuthContext.jsx";

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded, fontError] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  const onLayoutReady = useCallback(async () => {
    if (fontError) {
      console.warn("[BatwaraNow] Font load error (continuing):", fontError);
    }
    await SplashScreen.hideAsync().catch(() => {});
  }, [fontError]);

  useEffect(() => {
    if (loaded || fontError) {
      onLayoutReady();
    }
  }, [loaded, fontError, onLayoutReady]);

  if (!loaded && !fontError) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" />
          <Stack.Screen name="(drawer)" />
        </Stack>
        <StatusBar style="auto" />
      </AuthProvider>
    </ThemeProvider>
  );
}

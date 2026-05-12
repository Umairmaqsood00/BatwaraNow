import { Colors, CommonStyles } from "../constants/DesignSystem";
import { Redirect } from "expo-router";
import React from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

import { useAuth } from "../context/AuthContext.jsx";

/**
 * Initial route: show spinner while restoring session, then redirect declaratively.
 * Relying only on router.replace() in an effect is brittle on Android release builds.
 */
export default function AuthGateScreen() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.logo}>BatwaraNow</Text>
        <ActivityIndicator
          size="large"
          color={Colors.primary[500]}
          style={{ marginTop: 20 }}
        />
      </View>
    );
  }

  if (user) {
    return <Redirect href="/(drawer)" />;
  }

  return <Redirect href="/(auth)/login" />;
}

const styles = StyleSheet.create({
  container: {
    ...CommonStyles.container,
    justifyContent: "center",
    alignItems: "center",
  },
  logo: {
    ...CommonStyles.textH1,
    fontSize: 32,
    color: Colors.primary[500],
    fontWeight: "bold",
  },
});

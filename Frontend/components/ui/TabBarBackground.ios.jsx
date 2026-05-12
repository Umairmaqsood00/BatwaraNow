import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { StyleSheet, View } from "react-native";

export default function BlurTabBarBackground() {
  return (
    <View
      style={[StyleSheet.absoluteFill, { backgroundColor: "rgba(0,0,0,0.8)" }]}
    />
  );
}

export function useBottomTabOverflow() {
  return useBottomTabBarHeight();
}

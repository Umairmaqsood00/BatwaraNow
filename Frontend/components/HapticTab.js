import * as Haptics from "expo-haptics";
import { Platform, Pressable } from "react-native";



export function HapticTab({ children, onPress, ...props }) {
  const handlePress = () => {
    if (Platform.OS === "ios") {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    onPress?.();
  };

  return (
    <Pressable onPress={handlePress} {...props}>
      {children}
    </Pressable>
  );
}

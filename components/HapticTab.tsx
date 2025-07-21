import * as Haptics from "expo-haptics";
import { Platform, Pressable } from "react-native";

type HapticTabProps = {
  children: React.ReactNode;
  onPress?: () => void;
  [key: string]: any;
};

export function HapticTab({ children, onPress, ...props }: HapticTabProps) {
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

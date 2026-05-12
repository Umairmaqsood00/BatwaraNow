import { Alert, Platform } from "react-native";

/**
 * Two-action confirmation. On web, multi-button `Alert.alert` is unreliable (often becomes a
 * single OK dialog), so we use `window.confirm` instead.
 */
export function confirmTwoAction({
  title,
  message,
  cancelText = "Cancel",
  confirmText = "Confirm",
  destructive = false,
  onConfirm,
}) {
  if (Platform.OS === "web") {
    const ok =
      typeof window !== "undefined" &&
      window.confirm(`${title}\n\n${message}`);
    if (ok) {
      void Promise.resolve(onConfirm());
    }
    return;
  }
  Alert.alert(title, message, [
    { text: cancelText, style: "cancel" },
    {
      text: confirmText,
      style: destructive ? "destructive" : "default",
      onPress: () => void Promise.resolve(onConfirm()),
    },
  ]);
}

/** Single informational alert — works on web (`window.alert`) and native. */
export function alertOne(title, message) {
  if (Platform.OS === "web" && typeof window !== "undefined") {
    window.alert(`${title}\n\n${message}`);
    return;
  }
  Alert.alert(title, message);
}
